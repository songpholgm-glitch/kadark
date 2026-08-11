// MS SQL Server Database Layer for KadArk Quiz
const sql = require('mssql');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const dbConfig = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '',
    server: process.env.DB_SERVER || 'localhost',
    port: parseInt(process.env.DB_PORT || '1433', 10),
    database: process.env.DB_NAME || 'quizkadark',
    options: {
        encrypt: false, // Internal PEA Network
        trustServerCertificate: true,
        connectTimeout: 10000,
        requestTimeout: 15000
    }
};

let pool = null;
let isConnected = false;

// Initialize Database Connection and Auto-Create Tables
async function initDatabase() {
    try {
        console.log(`🔌 Connecting to MS SQL Server (${dbConfig.server}:${dbConfig.port}, DB: ${dbConfig.database})...`);
        pool = await sql.connect(dbConfig);
        isConnected = true;
        console.log(`✅ Connected successfully to MS SQL Server database: ${dbConfig.database}`);

        // Create Tables if not exist
        await createTablesIfNotExist();
        return true;
    } catch (err) {
        console.warn(`⚠️ Warning: Could not connect to MS SQL Server (${dbConfig.server}:${dbConfig.port}).`);
        console.warn(`👉 Error details: ${err.message}`);
        console.warn(`📁 Falling back to local JSON file storage.`);
        isConnected = false;
        return false;
    }
}

async function createTablesIfNotExist() {
    if (!isConnected || !pool) return;
    try {
        const createTablesQuery = `
            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Quizzes')
            BEGIN
                CREATE TABLE Quizzes (
                    id NVARCHAR(100) PRIMARY KEY,
                    title NVARCHAR(255) NOT NULL,
                    description NVARCHAR(MAX),
                    created_at DATETIME DEFAULT GETDATE(),
                    updated_at DATETIME DEFAULT GETDATE()
                );
            END;

            IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Questions')
            BEGIN
                CREATE TABLE Questions (
                    id INT IDENTITY(1,1) PRIMARY KEY,
                    quiz_id NVARCHAR(100) NOT NULL,
                    question_index INT NOT NULL,
                    question_text NVARCHAR(MAX) NOT NULL,
                    time_limit INT DEFAULT 20,
                    options_json NVARCHAR(MAX) NOT NULL,
                    correct_index INT NOT NULL,
                    FOREIGN KEY (quiz_id) REFERENCES Quizzes(id) ON DELETE CASCADE
                );
            END;
        `;
        await pool.request().query(createTablesQuery);
        console.log(`⚙️ DB Tables (Quizzes & Questions) checked/initialized successfully.`);
    } catch (err) {
        console.error(`❌ Error creating DB tables:`, err.message);
    }
}

// Get All Quizzes
async function getAllQuizzes() {
    if (isConnected && pool) {
        try {
            const quizResult = await pool.request().query(`SELECT * FROM Quizzes ORDER BY created_at DESC`);
            const quizzes = [];

            for (const q of quizResult.recordset) {
                const questResult = await pool.request()
                    .input('quiz_id', sql.NVarChar, q.id)
                    .query(`SELECT * FROM Questions WHERE quiz_id = @quiz_id ORDER BY question_index ASC`);

                const questions = questResult.recordset.map(quest => ({
                    id: 'q_' + quest.id,
                    question: quest.question_text,
                    time: quest.time_limit,
                    options: JSON.parse(quest.options_json),
                    correctIndex: quest.correct_index
                }));

                quizzes.push({
                    id: q.id,
                    title: q.title,
                    description: q.description || '',
                    createdAt: q.created_at,
                    questions
                });
            }
            return quizzes;
        } catch (err) {
            console.error(`❌ DB Error fetching quizzes:`, err.message);
        }
    }
    return null; // Signals fallback to filesystem
}

// Get Single Quiz By ID
async function getQuizById(id) {
    if (isConnected && pool) {
        try {
            const quizResult = await pool.request()
                .input('id', sql.NVarChar, id)
                .query(`SELECT * FROM Quizzes WHERE id = @id`);

            if (quizResult.recordset.length === 0) return null;
            const q = quizResult.recordset[0];

            const questResult = await pool.request()
                .input('quiz_id', sql.NVarChar, id)
                .query(`SELECT * FROM Questions WHERE quiz_id = @quiz_id ORDER BY question_index ASC`);

            const questions = questResult.recordset.map(quest => ({
                id: 'q_' + quest.id,
                question: quest.question_text,
                time: quest.time_limit,
                options: JSON.parse(quest.options_json),
                correctIndex: quest.correct_index
            }));

            return {
                id: q.id,
                title: q.title,
                description: q.description || '',
                createdAt: q.created_at,
                questions
            };
        } catch (err) {
            console.error(`❌ DB Error fetching quiz ${id}:`, err.message);
        }
    }
    return null;
}

// Save Quiz (Insert or Update)
async function saveQuiz(quizData) {
    if (isConnected && pool) {
        const transaction = new sql.Transaction(pool);
        try {
            await transaction.begin();

            const request = new sql.Request(transaction);
            request.input('id', sql.NVarChar, quizData.id);
            request.input('title', sql.NVarChar, quizData.title || 'ไม่มีชื่อ');
            request.input('description', sql.NVarChar, quizData.description || '');

            // Upsert Quiz
            await request.query(`
                IF EXISTS (SELECT 1 FROM Quizzes WHERE id = @id)
                BEGIN
                    UPDATE Quizzes SET title = @title, description = @description, updated_at = GETDATE() WHERE id = @id;
                END
                ELSE
                BEGIN
                    INSERT INTO Quizzes (id, title, description) VALUES (@id, @title, @description);
                END
            `);

            // Delete existing questions for this quiz before re-inserting
            const delReq = new sql.Request(transaction);
            delReq.input('quiz_id', sql.NVarChar, quizData.id);
            await delReq.query(`DELETE FROM Questions WHERE quiz_id = @quiz_id`);

            // Insert new questions
            if (Array.isArray(quizData.questions)) {
                for (let i = 0; i < quizData.questions.length; i++) {
                    const q = quizData.questions[i];
                    const qReq = new sql.Request(transaction);
                    qReq.input('quiz_id', sql.NVarChar, quizData.id);
                    qReq.input('q_index', sql.Int, i);
                    qReq.input('q_text', sql.NVarChar, q.question || '');
                    qReq.input('time_limit', sql.Int, parseInt(q.time || 20, 10));
                    qReq.input('options_json', sql.NVarChar, JSON.stringify(q.options || []));
                    qReq.input('correct_index', sql.Int, parseInt(q.correctIndex || 0, 10));

                    await qReq.query(`
                        INSERT INTO Questions (quiz_id, question_index, question_text, time_limit, options_json, correct_index)
                        VALUES (@quiz_id, @q_index, @q_text, @time_limit, @options_json, @correct_index)
                    `);
                }
            }

            await transaction.commit();
            console.log(`💾 Saved quiz '${quizData.title}' (${quizData.id}) to MS SQL Server.`);
            return true;
        } catch (err) {
            await transaction.rollback();
            console.error(`❌ DB Transaction Error saving quiz:`, err.message);
        }
    }
    return false;
}

// Delete Quiz
async function deleteQuiz(id) {
    if (isConnected && pool) {
        try {
            const req = pool.request();
            req.input('id', sql.NVarChar, id);
            await req.query(`DELETE FROM Quizzes WHERE id = @id`);
            console.log(`🗑️ Deleted quiz (${id}) from MS SQL Server.`);
            return true;
        } catch (err) {
            console.error(`❌ DB Error deleting quiz ${id}:`, err.message);
        }
    }
    return false;
}

module.exports = {
    initDatabase,
    getAllQuizzes,
    getQuizById,
    saveQuiz,
    deleteQuiz,
    isDbConnected: () => isConnected
};

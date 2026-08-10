const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const os = require('os');
const path = require('path');
const fs = require('fs');
const QRCode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;

// Helper: Get Local IPv4 Address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return '127.0.0.1';
}

const LOCAL_IP = getLocalIP();
const SERVER_URL = `http://${LOCAL_IP}:${PORT}`;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Quiz Storage Directory (Supports Vercel Read-Only File System Fallback)
const QUIZ_DIR = process.env.VERCEL ? path.join('/tmp', 'quizzes') : path.join(__dirname, 'public', 'data', 'quizzes');
const BUNDLED_QUIZ_DIR = path.join(__dirname, 'public', 'data', 'quizzes');

if (!fs.existsSync(QUIZ_DIR)) {
    try {
        fs.mkdirSync(QUIZ_DIR, { recursive: true });
    } catch (e) {
        console.error('Error creating QUIZ_DIR:', e);
    }
}

// Ensure default sample quizzes exist in repository
function ensureDefaultQuizzes() {
    const sampleFiles = [
        {
            filename: 'quiz-sample-01.json',
            data: {
                id: 'quiz-sample-01',
                title: '🎉 ความรู้รอบตัว & การ์ตูนสุดสนุก',
                description: 'คำถามรอบตัวตลกๆ ฮาๆ และความรู้ทั่วไป สำหรับทดสอบความไว',
                createdAt: new Date().toISOString(),
                questions: [
                    { id: 'q1', question: 'สัตว์ชนิดใดที่มีหัวใจอยู่ที่หัว?', options: ['กุ้ง', 'ปลาหมึก', 'ปู', 'หอยเชลล์'], correctIndex: 0, timeLimit: 20 },
                    { id: 'q2', question: "ประเทศใดขึ้นชื่อว่าเป็น 'ดินแดนแห่งอาทิตย์อุทัย'?", options: ['เกาหลีใต้', 'ญี่ปุ่น', 'จีน', 'เวียดนาม'], correctIndex: 1, timeLimit: 15 },
                    { id: 'q3', question: 'โดราเอมอน แมวไร้หู กลัวสัตว์ชนิดใดมากที่สุด?', options: ['แมวตัวอื่น', 'สุนัข', 'หนู', 'แมลงสาบ'], correctIndex: 2, timeLimit: 15 },
                    { id: 'q4', question: "ดาวเคราะห์ดวงใดในระบบสุริยะได้ชื่อว่าเป็น 'ดาวเคราะห์แดง'?", options: ['ดาวพุธ', 'ดาวศุกร์', 'ดาวเสาร์', 'ดาวอังคาร'], correctIndex: 3, timeLimit: 20 },
                    { id: 'q5', question: 'ผลไม้ชนิดใดต่อไปนี้มีปริมาณวิตามินซีสูงที่สุด?', options: ['ฝรั่ง', 'ส้ม', 'มะนาว', 'แอปเปิ้ล'], correctIndex: 0, timeLimit: 20 }
                ]
            }
        },
        {
            filename: 'quiz-sample-02.json',
            data: {
                id: 'quiz-sample-02',
                title: '💻 ไอทีและเทคโนโลยีสุดไฮเทค',
                description: 'ทายคำถามโลกไอที ภาษาคอมพิวเตอร์ และเทคโนโลยีสุดล้ำ',
                createdAt: new Date().toISOString(),
                questions: [
                    { id: 't1', question: 'ภาษาโปรแกรมมิ่งใดมีโลโก้เป็นรูปงูหลาม?', options: ['Java', 'Python', 'C++', 'JavaScript'], correctIndex: 1, timeLimit: 15 },
                    { id: 't2', question: 'HTML ย่อมาจากคำว่าอะไร?', options: ['HyperText Markup Language', 'High Tech Machine Language', 'HyperTransfer Mode Logic', 'Home Tool Markup List'], correctIndex: 0, timeLimit: 20 },
                    { id: 't3', question: 'ใครคือผู้ก่อตั้งบริษัท Microsoft?', options: ['Steve Jobs', 'Bill Gates', 'Mark Zuckerberg', 'Elon Musk'], correctIndex: 1, timeLimit: 15 },
                    { id: 't4', question: '1 Gigabyte (GB) เท่ากับกี่ Megabyte (MB)?', options: ['500 MB', '1000 MB', '1024 MB', '2048 MB'], correctIndex: 2, timeLimit: 20 }
                ]
            }
        }
    ];

    sampleFiles.forEach(s => {
        const filePath = path.join(QUIZ_DIR, s.filename);
        if (!fs.existsSync(filePath)) {
            fs.writeFileSync(filePath, JSON.stringify(s.data, null, 2), 'utf8');
        }
    });
}
ensureDefaultQuizzes();

// QUIZ REPOSITORY API ENDPOINTS

// Get list of all available quizzes in repository
app.get('/api/quizzes', (req, res) => {
    try {
        const files = fs.readdirSync(QUIZ_DIR).filter(f => f.endsWith('.json'));
        const list = files.map(file => {
            try {
                const content = fs.readFileSync(path.join(QUIZ_DIR, file), 'utf8');
                const parsed = JSON.parse(content);
                return {
                    id: parsed.id || file.replace('.json', ''),
                    title: parsed.title || 'คำถามไม่มีชื่อ',
                    description: parsed.description || '',
                    questionCount: parsed.questions ? parsed.questions.length : 0,
                    createdAt: parsed.createdAt || null
                };
            } catch (err) {
                return null;
            }
        }).filter(item => item !== null);

        res.json(list);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get detailed quiz by ID
app.get('/api/quizzes/:id', (req, res) => {
    try {
        const quizId = req.params.id;
        const filePath = path.join(QUIZ_DIR, `${quizId}.json`);
        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ error: 'ไม่พบชุดคำถามนี้ในระบบ' });
        }
        const content = fs.readFileSync(filePath, 'utf8');
        res.json(JSON.parse(content));
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Save or Update a quiz to server repository
app.post('/api/quizzes', (req, res) => {
    try {
        const quiz = req.body;
        if (!quiz || !quiz.title || !Array.isArray(quiz.questions)) {
            return res.status(400).json({ error: 'ข้อมูลชุดคำถามไม่ถูกต้อง' });
        }

        if (!quiz.id) {
            quiz.id = 'quiz-' + Date.now();
        }
        quiz.updatedAt = new Date().toISOString();

        const filePath = path.join(QUIZ_DIR, `${quiz.id}.json`);
        fs.writeFileSync(filePath, JSON.stringify(quiz, null, 2), 'utf8');

        console.log(`[Quiz Saved] ID: ${quiz.id} Title: "${quiz.title}" (${quiz.questions.length} questions)`);
        res.json({ success: true, quiz });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete quiz from server repository
app.delete('/api/quizzes/:id', (req, res) => {
    try {
        const quizId = req.params.id;
        const filePath = path.join(QUIZ_DIR, `${quizId}.json`);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`[Quiz Deleted] ID: ${quizId}`);
            res.json({ success: true });
        } else {
            res.status(404).json({ error: 'ไม่พบชุดคำถามที่ต้องการลบ' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// In-Memory Game Store
// roomCode -> Room Object
const rooms = {};

// Helper: Generate 6-digit PIN
function generateRoomCode() {
    let code;
    do {
        code = Math.floor(100000 + Math.random() * 900000).toString();
    } while (rooms[code]);
    return code;
}

// API Endpoint to get Server Info & QR Code
app.get('/api/server-info', async (req, res) => {
    try {
        const joinUrl = `${SERVER_URL}/player.html`;
        const qrSvg = await QRCode.toString(joinUrl, { type: 'svg', margin: 2, color: { dark: '#2B2D42', light: '#FFFFFF' } });
        res.json({
            ip: LOCAL_IP,
            port: PORT,
            serverUrl: SERVER_URL,
            joinUrl: joinUrl,
            qrSvg: qrSvg
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Socket.IO Logic
io.on('connection', (socket) => {
    console.log(`[Socket Connected] ID: ${socket.id}`);

    // --- HOST ACTIONS ---

    // Host creates a room with quiz data
    socket.on('host_create_room', async ({ quizData }) => {
        const roomCode = generateRoomCode();
        
        let currentBaseUrl = SERVER_URL;
        if (socket.handshake && socket.handshake.headers && socket.handshake.headers.host) {
            const host = socket.handshake.headers.host;
            const proto = socket.handshake.headers['x-forwarded-proto'] || 'http';
            currentBaseUrl = `${proto}://${host}`;
        }

        const playerJoinUrl = `${currentBaseUrl}/player.html?pin=${roomCode}`;
        const qrDataUrl = await QRCode.toDataURL(playerJoinUrl, { margin: 2, width: 250 });

        rooms[roomCode] = {
            code: roomCode,
            hostSocketId: socket.id,
            quiz: quizData,
            state: 'LOBBY', // LOBBY, QUESTION, REVEAL, LEADERBOARD, FINISHED
            currentQuestionIndex: -1,
            players: {}, // socketId -> { id, nickname, avatarId, score: 0, streak: 0, answers: {} }
            questionStartTime: 0,
            currentAnswers: {}, // socketId -> { optionIndex, timeTaken, pointsEarned, isCorrect }
            joinUrl: playerJoinUrl,
            qrDataUrl: qrDataUrl
        };

        socket.join(roomCode);
        socket.roomCode = roomCode;
        socket.isHost = true;

        socket.emit('room_created', {
            roomCode,
            serverUrl: currentBaseUrl,
            playerJoinUrl,
            qrDataUrl,
            quizTitle: quizData.title,
            totalQuestions: quizData.questions.length
        });

        console.log(`[Room Created] Code: ${roomCode} by Host Socket ${socket.id}`);
    });

    // Host starts game
    socket.on('host_start_game', () => {
        const roomCode = socket.roomCode;
        const room = rooms[roomCode];
        if (!room || room.hostSocketId !== socket.id) return;

        if (Object.keys(room.players).length === 0) {
            socket.emit('error_message', 'ต้องมีผู้เล่นอย่างน้อย 1 คนก่อนกดเริ่มเกม!');
            return;
        }

        room.currentQuestionIndex = 0;
        startCurrentQuestion(room);
    });

    // Host moves to reveal answer
    socket.on('host_trigger_reveal', () => {
        const roomCode = socket.roomCode;
        const room = rooms[roomCode];
        if (!room || room.hostSocketId !== socket.id) return;

        revealCurrentQuestion(room);
    });

    // Host triggers Top 5 Leaderboard
    socket.on('host_show_leaderboard', () => {
        const roomCode = socket.roomCode;
        const room = rooms[roomCode];
        if (!room || room.hostSocketId !== socket.id) return;

        room.state = 'LEADERBOARD';
        const allRankings = getTopPlayers(room, Object.keys(room.players).length);
        const leaderboard = allRankings.slice(0, 5);

        io.to(roomCode).emit('leaderboard_update', {
            questionIndex: room.currentQuestionIndex + 1,
            totalQuestions: room.quiz.questions.length,
            top5: leaderboard,
            isFinal: room.currentQuestionIndex >= room.quiz.questions.length - 1
        });

        // Send current rank & score to each individual mobile player
        allRankings.forEach((p) => {
            const pSocket = io.sockets.sockets.get(p.socketId);
            if (pSocket) {
                pSocket.emit('player_rank_update', {
                    rank: p.rank,
                    totalPlayers: allRankings.length,
                    score: p.score,
                    nickname: p.nickname,
                    avatarId: p.avatarId,
                    isFinal: false
                });
            }
        });
    });

    // Host proceeds to Next Question or Final Podium
    socket.on('host_next_step', () => {
        const roomCode = socket.roomCode;
        const room = rooms[roomCode];
        if (!room || room.hostSocketId !== socket.id) return;

        if (room.currentQuestionIndex < room.quiz.questions.length - 1) {
            room.currentQuestionIndex++;
            startCurrentQuestion(room);
        } else {
            // End Game -> Final Podium & All Player Rankings
            room.state = 'FINISHED';
            const finalRankings = getTopPlayers(room, Object.keys(room.players).length);
            
            // Send overall finish data to Host
            io.to(roomCode).emit('game_finished', {
                top5: finalRankings.slice(0, 5),
                allRankings: finalRankings,
                totalPlayers: finalRankings.length
            });

            // Send personal final rank to each mobile player (isFinal: true)
            finalRankings.forEach((p) => {
                const pSocket = io.sockets.sockets.get(p.socketId);
                if (pSocket) {
                    pSocket.emit('player_rank_update', {
                        rank: p.rank,
                        totalPlayers: finalRankings.length,
                        score: p.score,
                        nickname: p.nickname,
                        avatarId: p.avatarId,
                        isFinal: true
                    });
                }
            });
        }
    });

    // --- PLAYER ACTIONS ---

    // Player joins room
    socket.on('player_join', ({ roomCode, nickname, avatarId }) => {
        const room = rooms[roomCode];
        if (!room) {
            socket.emit('join_error', 'ไม่พบรหัสห้องนี้ (Room Code ไม่ถูกต้อง)');
            return;
        }

        if (room.state !== 'LOBBY') {
            socket.emit('join_error', 'การแข่งขันได้เริ่มขึ้นแล้ว ไม่สามารถเข้าร่วมได้ในขณะนี้');
            return;
        }

        // Check duplicate nickname in room
        const nameExists = Object.values(room.players).some(
            p => p.nickname.trim().toLowerCase() === nickname.trim().toLowerCase()
        );

        if (nameExists) {
            socket.emit('join_error', 'ชื่อนี้ถูกใช้งานแล้ว กรุณาเลือกชื่ออื่น');
            return;
        }

        const playerObj = {
            id: socket.id,
            nickname: nickname.trim(),
            avatarId: avatarId || 'cat',
            score: 0,
            streak: 0,
            answers: {}
        };

        room.players[socket.id] = playerObj;
        socket.join(roomCode);
        socket.roomCode = roomCode;

        socket.emit('join_success', {
            roomCode,
            player: playerObj
        });

        // Notify Host & Players about updated lobby player list
        io.to(room.hostSocketId).emit('lobby_players_update', {
            count: Object.keys(room.players).length,
            players: Object.values(room.players)
        });

        console.log(`[Player Joined] ${nickname} (Avatar: ${avatarId}) in Room ${roomCode}`);
    });

    // Player submits answer
    socket.on('player_submit_answer', ({ optionIndex }) => {
        const roomCode = socket.roomCode;
        const room = rooms[roomCode];
        if (!room || room.state !== 'QUESTION') return;

        const player = room.players[socket.id];
        if (!player) return;

        // Prevent double answering
        if (room.currentAnswers[socket.id]) return;

        const timeTaken = Date.now() - room.questionStartTime;
        const currentQ = room.quiz.questions[room.currentQuestionIndex];
        const isCorrect = optionIndex === currentQ.correctIndex;

        const answerRecord = {
            optionIndex,
            timeTaken,
            pointsEarned: 0, // Calculated during reveal
            isCorrect
        };

        room.currentAnswers[socket.id] = answerRecord;

        // Send feedback to player immediately
        socket.emit('answer_received', {
            optionIndex,
            timeTaken
        });

        // Notify host about response progress
        const totalAnswered = Object.keys(room.currentAnswers).length;
        const totalPlayers = Object.keys(room.players).length;

        io.to(room.hostSocketId).emit('answer_progress', {
            totalAnswered,
            totalPlayers
        });

        console.log(`[Answer Submitted] Player ${player.nickname} answered option ${optionIndex} in ${timeTaken}ms (Correct: ${isCorrect})`);

        // If everyone answered, auto-trigger reveal!
        if (totalAnswered >= totalPlayers) {
            revealCurrentQuestion(room);
        }
    });

    // Disconnect handling
    socket.on('disconnect', () => {
        const roomCode = socket.roomCode;
        if (!roomCode || !rooms[roomCode]) return;

        const room = rooms[roomCode];

        if (socket.isHost) {
            console.log(`[Host Disconnected] Room ${roomCode} closed.`);
            io.to(roomCode).emit('room_closed', 'Host ได้ออกจากห้อง การแข่งขันยุติลงแล้ว');
            delete rooms[roomCode];
        } else {
            if (room.players[socket.id]) {
                const nickname = room.players[socket.id].nickname;
                delete room.players[socket.id];
                delete room.currentAnswers[socket.id];

                console.log(`[Player Disconnected] ${nickname} from Room ${roomCode}`);

                if (room.state === 'LOBBY') {
                    io.to(room.hostSocketId).emit('lobby_players_update', {
                        count: Object.keys(room.players).length,
                        players: Object.values(room.players)
                    });
                }
            }
        }
    });
});

// Helper Functions for Game Flow

function startCurrentQuestion(room) {
    if (room.readyTimer) {
        clearTimeout(room.readyTimer);
        room.readyTimer = null;
    }

    room.state = 'GET_READY';
    room.currentAnswers = {};

    const q = room.quiz.questions[room.currentQuestionIndex];

    const prepareData = {
        questionIndex: room.currentQuestionIndex + 1,
        totalQuestions: room.quiz.questions.length,
        question: q.question,
        options: q.options,
        timeLimit: q.timeLimit,
        getReadySeconds: 3
    };

    // Emit 3-second Get Ready warm-up to Host & All Mobile Players simultaneously
    io.to(room.code).emit('prepare_question', prepareData);

    // After 3 seconds, start the actual question timer & enable answering
    room.readyTimer = setTimeout(() => {
        if (!rooms[room.code] || room.state !== 'GET_READY') return;

        room.state = 'QUESTION';
        room.questionStartTime = Date.now();

        // Sanitize question data for clients
        const clientQuestion = {
            questionIndex: room.currentQuestionIndex + 1,
            totalQuestions: room.quiz.questions.length,
            question: q.question,
            options: q.options,
            timeLimit: q.timeLimit
        };

        io.to(room.code).emit('start_question', clientQuestion);
    }, 3000);
}

function revealCurrentQuestion(room) {
    if (room.state !== 'QUESTION' && room.state !== 'GET_READY') return;

    if (room.readyTimer) {
        clearTimeout(room.readyTimer);
        room.readyTimer = null;
    }

    room.state = 'REVEAL';

    const currentQ = room.quiz.questions[room.currentQuestionIndex];
    const totalPlayers = Object.keys(room.players).length;

    // 1. Find all players who answered correctly
    const correctAnswers = Object.entries(room.currentAnswers).filter(([_, ans]) => ans.isCorrect);

    // 2. Calculate relative speed scores (Fastest = 1000 pts, Slowest = 100 pts)
    if (correctAnswers.length === 1) {
        correctAnswers[0][1].pointsEarned = 1000;
    } else if (correctAnswers.length >= 2) {
        const times = correctAnswers.map(([_, ans]) => ans.timeTaken);
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        correctAnswers.forEach(([_, ans]) => {
            if (maxTime === minTime) {
                ans.pointsEarned = 1000;
            } else {
                const ratio = (ans.timeTaken - minTime) / (maxTime - minTime);
                ans.pointsEarned = Math.round(1000 - ratio * 900);
            }
        });
    }

    // 3. Update cumulative score and streak for all players
    Object.keys(room.players).forEach(socketId => {
        const p = room.players[socketId];
        const ans = room.currentAnswers[socketId];

        if (ans) {
            if (ans.isCorrect) {
                p.score += ans.pointsEarned;
                p.streak += 1;
            } else {
                ans.pointsEarned = 0;
                p.streak = 0;
            }
            p.answers[room.currentQuestionIndex] = ans;
        } else {
            p.streak = 0;
        }
    });

    // Count answers for each option
    const optionCounts = Array(currentQ.options.length).fill(0);
    const correctPlayers = [];
    const incorrectPlayers = [];

    Object.entries(room.currentAnswers).forEach(([socketId, ans]) => {
        if (ans.optionIndex >= 0 && ans.optionIndex < optionCounts.length) {
            optionCounts[ans.optionIndex]++;
        }
        const p = room.players[socketId];
        if (p) {
            const info = {
                nickname: p.nickname,
                avatarId: p.avatarId,
                timeTakenSec: (ans.timeTaken / 1000).toFixed(2),
                pointsEarned: ans.pointsEarned,
                totalScore: p.score
            };
            if (ans.isCorrect) {
                correctPlayers.push(info);
            } else {
                incorrectPlayers.push(info);
            }
        }
    });

    // Sort correct players by speed (pointsEarned descending)
    correctPlayers.sort((a, b) => b.pointsEarned - a.pointsEarned);

    // Send individual results to ALL connected players
    Object.keys(room.players).forEach(socketId => {
        const pSocket = io.sockets.sockets.get(socketId);
        const ans = room.currentAnswers[socketId];
        if (!ans) {
            room.players[socketId].streak = 0;
        }

        if (pSocket) {
            pSocket.emit('question_result', {
                answered: !!ans,
                isCorrect: ans ? ans.isCorrect : false,
                correctIndex: currentQ.correctIndex,
                correctOptionText: currentQ.options[currentQ.correctIndex],
                pointsEarned: ans ? ans.pointsEarned : 0,
                totalScore: room.players[socketId].score,
                streak: room.players[socketId].streak
            });
        }
    });

    // Send full statistics to Host
    io.to(room.hostSocketId).emit('question_reveal', {
        questionIndex: room.currentQuestionIndex + 1,
        totalQuestions: room.quiz.questions.length,
        correctIndex: currentQ.correctIndex,
        correctOptionText: currentQ.options[currentQ.correctIndex],
        optionCounts,
        correctPlayers,
        incorrectPlayers,
        totalAnswered: Object.keys(room.currentAnswers).length,
        totalPlayers
    });
}

function getTopPlayers(room, limit = 5) {
    return Object.values(room.players)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map((p, index) => ({
            rank: index + 1,
            socketId: p.id,
            nickname: p.nickname,
            avatarId: p.avatarId,
            score: p.score,
            streak: p.streak
        }));
}

// Export Server Handler for Vercel Serverless & Local Node Execution
module.exports = (req, res) => {
    server.emit('request', req, res);
};
module.exports.app = app;
module.exports.server = server;

if (require.main === module) {
    // Start HTTP Server for local development
    server.listen(PORT, '0.0.0.0', () => {
        console.log(`===================================================`);
        console.log(`🚀 KADARK KAHOOT-STYLE QUIZ SERVER RUNNING`);
        console.log(`📡 Local Network Access URL: ${SERVER_URL}`);
        console.log(`📱 Scan QR Code or open ${SERVER_URL}/player.html on mobile`);
        console.log(`===================================================`);
    });
}

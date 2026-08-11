// Quiz Editor Logic

let currentQuizData = {
    id: 'custom-quiz-' + Date.now(),
    title: 'ควิซความรู้ทั่วไปของฉัน',
    description: 'สร้างโดยระบบ KadArk Quiz Builder',
    questions: []
};

// Initial Load
window.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const isNew = urlParams.get('action') === 'new';

    if (isNew) {
        resetToBlankQuiz();
    } else {
        // Load existing custom quiz from localStorage or fallback to server sample
        const saved = localStorage.getItem('kadark_custom_quiz');
        if (saved) {
            try {
                currentQuizData = JSON.parse(saved);
            } catch (e) {
                console.error(e);
            }
        } else {
            try {
                const res = await fetch('/api/quizzes');
                const list = await res.json();
                if (list && list.length > 0) {
                    const quizRes = await fetch(`/api/quizzes/${list[0].id}`);
                    currentQuizData = await quizRes.json();
                }
            } catch (e) {
                console.error(e);
            }
        }
    }

    updateHeaderUI();
    renderQuestionsList();
});

function resetToBlankQuiz() {
    currentQuizData = {
        id: 'quiz-' + Date.now(),
        title: 'ชุดคำถามใหม่ของฉัน',
        description: 'สร้างโดยระบบ KadArk Quiz Builder',
        createdAt: new Date().toISOString(),
        questions: []
    };
    saveToLocalStorage();
}

function createNewQuiz() {
    if (currentQuizData.questions.length > 0) {
        if (!confirm('คุณต้องการสร้างชุดคำถามใหม่ใช่หรือไม่? (คำถามเดิมที่ไม่ได้บันทึกลงเซิร์ฟเวอร์จะหายไป)')) {
            return;
        }
    }
    resetToBlankQuiz();
    updateHeaderUI();
    renderQuestionsList();
    openQuestionModal(); // Open add question modal automatically!
}

function updateHeaderUI() {
    document.getElementById('quizTitle').value = currentQuizData.title || '';
    document.getElementById('quizDesc').value = currentQuizData.description || '';
}

// Title & Description input changes
document.getElementById('quizTitle').addEventListener('input', (e) => {
    currentQuizData.title = e.target.value;
    saveToLocalStorage();
});

document.getElementById('quizDesc').addEventListener('input', (e) => {
    currentQuizData.description = e.target.value;
    saveToLocalStorage();
});

function renderQuestionsList() {
    const container = document.getElementById('questionsContainer');
    document.getElementById('questionCountBadge').innerText = currentQuizData.questions.length;
    container.innerHTML = '';

    if (currentQuizData.questions.length === 0) {
        container.innerHTML = `
            <div class="glass-panel" style="padding: 3rem; text-align: center; color: var(--text-muted);">
                ยังไม่มีรายการคำถาม กรุณากดปุ่ม <b>"➕ เพิ่มคำถามใหม่"</b> เพื่อเริ่มสร้างข้อสอบ
            </div>
        `;
        return;
    }

    currentQuizData.questions.forEach((q, idx) => {
        const item = document.createElement('div');
        item.className = 'glass-panel';
        item.style.padding = '1.5rem';
        item.style.display = 'flex';
        item.style.justifySpaceBetween = 'space-between';
        item.style.alignItems = 'center';

        const optionsHtml = q.options.map((opt, i) => `
            <span style="display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 0.9rem; ${i === q.correctIndex ? 'background: #26890c; color: white; font-weight: 700;' : 'background: rgba(255,255,255,0.08);'}">
                ${['▲', '◆', '●', '■'][i]} ${escapeHtml(opt)}
            </span>
        `).join(' ');

        item.innerHTML = `
            <div style="flex: 1; padding-right: 1.5rem;">
                <div style="font-size: 1.2rem; font-weight: 700; margin-bottom: 8px;">
                    ข้อที่ ${idx + 1}: ${escapeHtml(q.question)}
                    <span style="font-size: 0.85rem; color: #ff7eb3; background: rgba(255,126,179,0.15); padding: 2px 8px; border-radius: 8px; margin-left: 10px;">⏱️ ${q.timeLimit || 20}s</span>
                </div>
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                    ${optionsHtml}
                </div>
            </div>
            <div style="display: flex; gap: 10px;">
                <button class="btn btn-outline" style="padding: 8px 16px;" onclick="editQuestion(${idx})">✏️ แก้ไข</button>
                <button class="btn btn-outline" style="padding: 8px 16px; border-color: #e21b3c; color: #e21b3c;" onclick="deleteQuestion(${idx})">🗑️ ลบ</button>
            </div>
        `;

        container.appendChild(item);
    });
}

function openQuestionModal(editIdx = -1) {
    document.getElementById('editIndex').value = editIdx;
    const modalTitle = document.getElementById('modalTitle');

    if (editIdx >= 0) {
        modalTitle.innerText = `✏️ แก้ไขคำถามข้อที่ ${editIdx + 1}`;
        const q = currentQuizData.questions[editIdx];
        document.getElementById('modalQText').value = q.question;
        document.getElementById('modalQTime').value = q.timeLimit || 20;

        for (let i = 0; i < 4; i++) {
            document.getElementById(`opt${i}`).value = q.options[i] || '';
        }

        const radios = document.getElementsByName('correctChoice');
        radios[q.correctIndex || 0].checked = true;
    } else {
        modalTitle.innerText = '➕ เพิ่มคำถามใหม่';
        document.getElementById('questionForm').reset();
    }

    document.getElementById('modalBackdrop').style.display = 'flex';
}

function closeQuestionModal() {
    document.getElementById('modalBackdrop').style.display = 'none';
}

function saveQuestion(e) {
    e.preventDefault();
    const editIdx = parseInt(document.getElementById('editIndex').value);
    const qText = document.getElementById('modalQText').value.trim();
    const qTime = parseInt(document.getElementById('modalQTime').value);

    const options = [
        document.getElementById('opt0').value.trim(),
        document.getElementById('opt1').value.trim(),
        document.getElementById('opt2').value.trim(),
        document.getElementById('opt3').value.trim()
    ];

    const radios = document.getElementsByName('correctChoice');
    let correctIndex = 0;
    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            correctIndex = i;
            break;
        }
    }

    const qObj = {
        id: 'q-' + Date.now(),
        question: qText,
        options,
        correctIndex,
        timeLimit: qTime
    };

    if (editIdx >= 0) {
        currentQuizData.questions[editIdx] = qObj;
    } else {
        currentQuizData.questions.push(qObj);
    }

    saveToLocalStorage();
    renderQuestionsList();
    closeQuestionModal();
}

function editQuestion(idx) {
    openQuestionModal(idx);
}

function deleteQuestion(idx) {
    if (confirm(`คุณต้องการลบคำถามข้อที่ ${idx + 1} หรือไม่?`)) {
        currentQuizData.questions.splice(idx, 1);
        saveToLocalStorage();
        renderQuestionsList();
    }
}

function saveToLocalStorage() {
    localStorage.setItem('kadark_custom_quiz', JSON.stringify(currentQuizData));
}

// Export Quiz to JSON file
function exportQuizJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentQuizData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `quiz-${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
}

// Import Quiz from JSON file
function triggerImportJSON() {
    document.getElementById('fileInputJSON').click();
}

function importQuizJSON(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const imported = JSON.parse(e.target.result);
            if (imported.questions && Array.isArray(imported.questions)) {
                currentQuizData = imported;
                document.getElementById('quizTitle').value = currentQuizData.title || '';
                saveToLocalStorage();
                renderQuestionsList();
                alert('นำเข้าชุดคำถามสำเร็จ!');
            } else {
                alert('รูปแบบไฟล์ JSON ไม่ถูกต้อง');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// Save Current Quiz to Server Repository
async function saveQuizToServer() {
    if (!currentQuizData.title || currentQuizData.title.trim() === '') {
        alert('กรุณาระบุชื่อชุดคำถามก่อนบันทึก');
        return;
    }

    if (!currentQuizData.questions || currentQuizData.questions.length === 0) {
        alert('ชุดคำถามต้องมีอย่างน้อย 1 ข้อก่อนบันทึกลงเซิร์ฟเวอร์');
        return;
    }

    try {
        const res = await fetch('/api/quizzes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentQuizData)
        });

        const result = await res.json();
        if (res.ok && result.success) {
            currentQuizData = result.quiz;
            saveToLocalStorage();
            alert(`🎉 บันทึกชุดคำถาม "${currentQuizData.title}" ลงคลังเซิร์ฟเวอร์เรียบร้อยแล้ว!\nผู้อื่นสามารถเลือกชุดคำถามนี้ไปเล่นที่หน้า Host ได้ทันที`);
        } else {
            alert('เกิดข้อผิดพลาดในการบันทึก: ' + (result.error || 'ไม่ทราบสาเหตุ'));
        }
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์: ' + err.message);
    }
}

// Server Repository Modal Logic
async function openRepoModal() {
    document.getElementById('repoModalBackdrop').style.display = 'flex';
    fetchRepoQuizzes();
}

function closeRepoModal() {
    document.getElementById('repoModalBackdrop').style.display = 'none';
}

async function fetchRepoQuizzes() {
    const container = document.getElementById('repoQuizList');
    try {
        const res = await fetch('/api/quizzes');
        const list = await res.json();
        container.innerHTML = '';

        if (!list || list.length === 0) {
            container.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">ไม่พบชุดคำถามในคลังเซิร์ฟเวอร์</div>';
            return;
        }

        list.forEach(q => {
            const item = document.createElement('div');
            item.className = 'glass-panel';
            item.style.cssText = 'padding: 1.2rem; display: flex; justify-content: space-between; align-items: center; border-radius: 16px;';
            item.innerHTML = `
                <div>
                    <h4 style="font-size: 1.2rem; margin-bottom: 4px; color: #fff;">${escapeHtml(q.title)}</h4>
                    <p style="color: var(--text-muted); font-size: 0.9rem;">${escapeHtml(q.description || 'ไม่มีคำอธิบาย')} &bull; <span style="color: #ff7eb3; font-weight: 700;">${q.questionCount} คำถาม</span></p>
                </div>
                <div style="display: flex; gap: 8px;">
                    <button class="btn btn-primary" style="padding: 6px 14px; font-size: 0.9rem;" onclick="loadQuizFromServer('${q.id}')">✏️ โหลดมาแก้ไข</button>
                    <button class="btn btn-outline" style="padding: 6px 14px; font-size: 0.9rem; border-color: #ff5252; color: #ff5252;" onclick="deleteQuizFromServer('${q.id}', '${escapeHtml(q.title)}')">🗑️ ลบ</button>
                </div>
            `;
            container.appendChild(item);
        });
    } catch (err) {
        container.innerHTML = '<div style="color: #ff5252; text-align: center;">เกิดข้อผิดพลาดในการโหลดคลังชุดคำถาม</div>';
    }
}

async function loadQuizFromServer(quizId) {
    try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error('ไม่พบข้อมูลชุดคำถาม');
        currentQuizData = await res.json();
        updateHeaderUI();
        renderQuestionsList();
        saveToLocalStorage();
        closeRepoModal();
        alert(`โหลดชุดคำถาม "${currentQuizData.title}" สำเร็จ!`);
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการโหลดชุดคำถาม: ' + err.message);
    }
}

async function deleteQuizFromServer(quizId, title) {
    if (confirm(`คุณต้องการลบชุดคำถาม "${title}" ออกจากคลังเซิร์ฟเวอร์หรือไม่?`)) {
        try {
            const res = await fetch(`/api/quizzes/${quizId}`, { method: 'DELETE' });
            if (res.ok) {
                fetchRepoQuizzes();
            } else {
                alert('เกิดข้อผิดพลาดในการลบชุดคำถาม');
            }
        } catch (err) {
            alert('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์: ' + err.message);
        }
    }
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

// Host Client Logic
const socket = io();

let currentRoomCode = null;
let currentQuiz = null;
let timerInterval = null;
let currentQuestionIndex = 0;
let totalQuestions = 0;
let activeQuestionData = null;

// DOM Elements
const screenQuizSelect = document.getElementById('screenQuizSelect');
const screenLobby = document.getElementById('screenLobby');
const screenGetReady = document.getElementById('screenGetReady');
const screenQuestion = document.getElementById('screenQuestion');
const screenReveal = document.getElementById('screenReveal');
const screenLeaderboard = document.getElementById('screenLeaderboard');
const screenFinal = document.getElementById('screenFinal');

let readyTimerInterval = null;

function showScreen(screenId) {
    [screenQuizSelect, screenLobby, screenGetReady, screenQuestion, screenReveal, screenLeaderboard, screenFinal].forEach(s => {
        if (s) s.style.display = (s.id === screenId) ? 'block' : 'none';
    });
}

function toggleMuteSound(btn) {
    if (typeof soundEngine !== 'undefined') {
        soundEngine.init();
        const isMuted = soundEngine.toggleMute();
        if (btn) {
            btn.innerText = isMuted ? '🔇 ปิดเสียงอยู่' : '🔊 เปิดเสียงอยู่';
            btn.style.background = isMuted ? 'rgba(255, 82, 82, 0.25)' : 'rgba(255, 215, 0, 0.15)';
            btn.style.borderColor = isMuted ? '#ff5252' : '#FFD700';
            btn.style.color = isMuted ? '#ff5252' : '#FFD700';
        }
    }
}

// Automatically fetch server quiz repository on load
window.addEventListener('DOMContentLoaded', () => {
    fetchServerQuizzes();
});

async function fetchServerQuizzes() {
    const container = document.getElementById('quizListContainer');
    try {
        const res = await fetch('/api/quizzes');
        const list = await res.json();
        container.innerHTML = '';

        if (!list || list.length === 0) {
            container.innerHTML = '<div style="color: var(--text-muted);">ไม่พบชุดคำถามในคลัง กรุณาสร้างชุดคำถามใหม่ที่ Quiz Editor</div>';
            return;
        }

        list.forEach(q => {
            const card = document.createElement('div');
            card.className = 'glass-panel';
            card.style.cssText = 'padding: 1.5rem; text-align: left; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: transform 0.2s ease; margin-bottom: 10px;';
            card.onmouseenter = () => card.style.transform = 'translateY(-3px)';
            card.onmouseleave = () => card.style.transform = 'translateY(0)';

            card.innerHTML = `
                <div>
                    <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 6px;">${escapeHtml(q.title)}</h3>
                    <p style="color: var(--text-muted); font-size: 0.95rem;">${escapeHtml(q.description || 'ไม่มีคำอธิบาย')} &bull; <span style="color: #ff7eb3; font-weight: 700;">${q.questionCount} คำถาม</span></p>
                </div>
                <button class="btn btn-primary" onclick="selectServerQuiz('${q.id}', event)">🎯 เลือกเล่นชุดนี้</button>
            `;
            container.appendChild(card);
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = '<div style="color: #ff5252;">เกิดข้อผิดพลาดในการโหลดคลังชุดคำถาม</div>';
    }
}

async function selectServerQuiz(quizId, event) {
    if (event) event.stopPropagation();
    try {
        const res = await fetch(`/api/quizzes/${quizId}`);
        if (!res.ok) throw new Error('ไม่พบข้อมูลชุดคำถาม');
        const quizData = await res.json();
        currentQuiz = quizData;
        createRoom(currentQuiz);
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการโหลดควิซ: ' + err.message);
    }
}

// Load default sample quiz fallback
async function loadDefaultQuiz() {
    try {
        const res = await fetch('/api/quizzes');
        const list = await res.json();
        if (list && list.length > 0) {
            selectServerQuiz(list[0].id);
        } else {
            alert('ไม่พบชุดคำถามในระบบ');
        }
    } catch (err) {
        alert('เกิดข้อผิดพลาดในการโหลดข้อสอบ: ' + err.message);
    }
}

// Create room with quiz data
function createRoom(quizData) {
    socket.emit('host_create_room', { quizData });
}

// Listen for Room Creation Response
socket.on('room_created', (data) => {
    currentRoomCode = data.roomCode;
    totalQuestions = data.totalQuestions;

    document.getElementById('roomInfoHead').style.display = 'block';
    document.getElementById('headRoomPin').innerText = data.roomCode;
    document.getElementById('lobbyPinDisplay').innerText = data.roomCode;
    document.getElementById('lobbyUrlDisplay').innerText = data.playerJoinUrl;
    document.getElementById('lobbyQrImage').src = data.qrDataUrl;

    showScreen('screenLobby');
});

// Listen for player updates in lobby
socket.on('lobby_players_update', ({ count, players }) => {
    document.getElementById('playerCountBadge').innerText = count;
    const grid = document.getElementById('lobbyPlayersGrid');
    grid.innerHTML = '';

    players.forEach(p => {
        const chip = document.createElement('div');
        chip.className = 'player-chip';
        chip.innerHTML = `
            ${getAvatarSVG(p.avatarId, 45)}
            <span class="player-chip-name">${escapeHtml(p.nickname)}</span>
        `;
        grid.appendChild(chip);
    });
});

// Start Game button pressed by Host
function startGame() {
    socket.emit('host_start_game');
}

// 3-Second Prepare Warm-up Countdown
socket.on('prepare_question', (data) => {
    document.getElementById('readyQNum').innerText = data.questionIndex;
    document.getElementById('readyQTotal').innerText = data.totalQuestions;
    
    let count = data.getReadySeconds || 3;
    const numElem = document.getElementById('readyCountdownNum');
    numElem.innerText = count;
    soundEngine.playGetReadyBeep(count);

    clearInterval(readyTimerInterval);
    readyTimerInterval = setInterval(() => {
        count--;
        if (count > 0) {
            numElem.innerText = count;
            soundEngine.playGetReadyBeep(count);
        } else {
            numElem.innerText = 'ลุย!';
            soundEngine.playGetReadyBeep(4);
            clearInterval(readyTimerInterval);
        }
    }, 1000);

    showScreen('screenGetReady');
});

// Start question handler
socket.on('start_question', (data) => {
    clearInterval(readyTimerInterval);
    activeQuestionData = data;
    currentQuestionIndex = data.questionIndex - 1;

    document.getElementById('qCurrentIndex').innerText = data.questionIndex;
    document.getElementById('qTotalIndex').innerText = data.totalQuestions;
    document.getElementById('questionText').innerText = data.question;
    document.getElementById('answeredCount').innerText = '0';
    document.getElementById('totalPlayersCount').innerText = document.getElementById('playerCountBadge').innerText;

    // Play ticking countdown sound!
    soundEngine.playCountdownTicking(data.timeLimit);

    // Set options
    const optionsGrid = document.getElementById('optionsGrid');
    for (let i = 0; i < 4; i++) {
        const card = document.getElementById(`optCard${i}`);
        const text = document.getElementById(`optText${i}`);
        if (data.options[i]) {
            card.style.display = 'flex';
            card.className = `option-host-card opt-${i}`;
            text.innerText = data.options[i];
        } else {
            card.style.display = 'none';
        }
    }

    // Start timer
    let timeLeft = data.timeLimit;
    const timerElem = document.getElementById('qTimer');
    timerElem.innerText = timeLeft;

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
        timeLeft--;
        timerElem.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            triggerReveal();
        }
    }, 1000);

    showScreen('screenQuestion');
});

// Update answer counter in real-time
socket.on('answer_progress', ({ totalAnswered, totalPlayers }) => {
    document.getElementById('answeredCount').innerText = totalAnswered;
    document.getElementById('totalPlayersCount').innerText = totalPlayers;
});

// Trigger reveal answer
function triggerReveal() {
    clearInterval(timerInterval);
    soundEngine.stopCountdownTicks();
    socket.emit('host_trigger_reveal');
}

// Question Reveal Response
socket.on('question_reveal', (data) => {
    clearInterval(timerInterval);
    soundEngine.playTimesUp();

    document.getElementById('revealQNum').innerText = data.questionIndex;
    document.getElementById('revealQText').innerText = activeQuestionData ? activeQuestionData.question : '';

    const shapeIcons = ['▲', '◆', '●', '■'];
    document.getElementById('revealCorrectShape').innerText = shapeIcons[data.correctIndex] || '✅';
    document.getElementById('revealCorrectText').innerText = data.correctOptionText || '';

    // Highlight correct answer and dim wrong answers
    for (let i = 0; i < 4; i++) {
        const card = document.getElementById(`optCard${i}`);
        if (i === data.correctIndex) {
            card.className = `option-host-card opt-${i} correct-answer`;
        } else {
            card.className = `option-host-card opt-${i} dimmed`;
        }
    }

    // Render stats bar chart
    const maxCount = Math.max(...data.optionCounts, 1);
    for (let i = 0; i < 4; i++) {
        const count = data.optionCounts[i] || 0;
        document.getElementById(`count${i}`).innerText = count;
        const heightPct = Math.round((count / maxCount) * 180);
        document.getElementById(`bar${i}`).style.height = `${Math.max(heightPct, 12)}px`;
    }

    // Render list of correct players with names & avatars
    const correctList = document.getElementById('correctPlayersList');
    document.getElementById('correctCountBadge').innerText = data.correctPlayers.length;
    correctList.innerHTML = '';

    if (data.correctPlayers.length === 0) {
        correctList.innerHTML = '<span style="color: var(--text-muted);">ไม่มีผู้เล่นตอบถูกในข้อนี้</span>';
    } else {
        data.correctPlayers.forEach(p => {
            const item = document.createElement('div');
            item.className = 'player-chip';
            item.style.background = 'rgba(38, 137, 12, 0.25)';
            item.style.borderColor = '#26890c';
            item.innerHTML = `
                ${getAvatarSVG(p.avatarId, 40)}
                <div>
                    <div style="font-weight: 700;">${escapeHtml(p.nickname)}</div>
                    <div style="font-size: 0.8rem; color: #43e97b;">+${p.pointsEarned} pts (${p.timeTakenSec}s)</div>
                </div>
            `;
            correctList.appendChild(item);
        });
    }

    showScreen('screenReveal');
});

// Show Top 5 Leaderboard
function showLeaderboard() {
    socket.emit('host_show_leaderboard');
}

socket.on('leaderboard_update', (data) => {
    const list = document.getElementById('lbList');
    list.innerHTML = '';

    const btnNext = document.getElementById('btnNextStep');
    if (data.isFinal) {
        btnNext.innerText = '👑 สรุปผลรางวัลผู้ชนะ (Final Winners)';
        btnNext.className = 'btn btn-primary btn-lg';
    } else {
        btnNext.innerText = '➡️ ลุยคำถามข้อถัดไป (Next Question)';
        btnNext.className = 'btn btn-success btn-lg';
    }

    data.top5.forEach((p, idx) => {
        const item = document.createElement('div');
        item.className = `lb-item rank-${p.rank}`;
        item.style.animationDelay = `${idx * 0.15}s`;
        item.innerHTML = `
            <div class="lb-rank">#${p.rank}</div>
            <div class="lb-player-info">
                ${getAvatarSVG(p.avatarId, 50)}
                <div class="lb-name">${escapeHtml(p.nickname)}</div>
            </div>
            <div class="lb-score">${p.score.toLocaleString()} pts</div>
        `;
        list.appendChild(item);
    });

    showScreen('screenLeaderboard');
});

function nextQuestionOrFinish() {
    socket.emit('host_next_step');
}

// Game Finished -> Render Final Podium & All Players List
socket.on('game_finished', ({ top5, allRankings, totalPlayers }) => {
    // 1st, 2nd, 3rd place podium rendering
    const p1 = top5[0];
    const p2 = top5[1];
    const p3 = top5[2];

    renderPodiumCard('pCard1', p1);
    renderPodiumCard('pCard2', p2);
    renderPodiumCard('pCard3', p3);

    // Full All-Players List rendering
    const allList = document.getElementById('allPlayersFullList');
    document.getElementById('allPlayersTotalBadge').innerText = totalPlayers || (allRankings ? allRankings.length : 0);
    allList.innerHTML = '';

    const rankingsToRender = allRankings || top5;
    rankingsToRender.forEach(p => {
        const row = document.createElement('div');
        let bgStyle = 'background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);';
        if (p.rank === 1) bgStyle = 'background: linear-gradient(135deg, rgba(255, 215, 0, 0.25), rgba(255, 160, 0, 0.15)); border: 1px solid #ffd700;';
        else if (p.rank === 2) bgStyle = 'background: linear-gradient(135deg, rgba(192, 192, 192, 0.25), rgba(112, 128, 144, 0.15)); border: 1px solid #c0c0c0;';
        else if (p.rank === 3) bgStyle = 'background: linear-gradient(135deg, rgba(205, 127, 50, 0.25), rgba(139, 69, 19, 0.15)); border: 1px solid #cd7f32;';

        row.style.cssText = `display: flex; justify-content: space-between; align-items: center; padding: 12px 20px; border-radius: 16px; ${bgStyle}`;
        row.innerHTML = `
            <div style="display: flex; align-items: center; gap: 16px;">
                <span style="font-weight: 800; font-size: 1.4rem; width: 45px; color: ${p.rank <= 3 ? '#ffd700' : 'var(--text-muted)'};">#${p.rank}</span>
                ${getAvatarSVG(p.avatarId, 45)}
                <span style="font-weight: 700; font-size: 1.2rem;">${escapeHtml(p.nickname)}</span>
            </div>
            <span style="font-weight: 800; color: #43e97b; font-size: 1.3rem; font-family: 'Outfit', sans-serif;">${p.score.toLocaleString()} pts</span>
        `;
        allList.appendChild(row);
    });

    showScreen('screenFinal');
    soundEngine.playPodiumFanfare();

    // Trigger Confetti Celebration!
    if (typeof confetti === 'function') {
        confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.6 }
        });
    }
});

function renderPodiumCard(containerId, player) {
    const elem = document.getElementById(containerId);
    if (!player) {
        elem.innerHTML = '<span style="color: var(--text-muted);">-</span>';
        return;
    }
    elem.innerHTML = `
        ${getAvatarSVG(player.avatarId, 65)}
        <div class="podium-name">${escapeHtml(player.nickname)}</div>
        <div class="podium-score">${player.score.toLocaleString()} pts</div>
    `;
}

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

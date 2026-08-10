// Player Client Logic
const socket = io({
    transports: ['polling', 'websocket'],
    upgrade: true
});

let selectedAvatarId = 'cat';
let myPlayerData = null;
let currentQuestionTime = 0;
let answerSubmitted = false;

// DOM Elements
const screenJoin = document.getElementById('screenJoin');
const screenWaiting = document.getElementById('screenWaiting');
const screenPlayerGetReady = document.getElementById('screenPlayerGetReady');
const screenAnswer = document.getElementById('screenAnswer');
const screenAnsweredWaiting = document.getElementById('screenAnsweredWaiting');
const screenFeedback = document.getElementById('screenFeedback');
const screenPlayerLeaderboard = document.getElementById('screenPlayerLeaderboard');

let playerReadyTimer = null;

function showPlayerScreen(screenElem) {
    [screenJoin, screenWaiting, screenPlayerGetReady, screenAnswer, screenAnsweredWaiting, screenFeedback, screenPlayerLeaderboard].forEach(s => {
        if (s) {
            s.style.display = (s === screenElem) ? (screenElem === screenAnswer ? 'flex' : 'block') : 'none';
        }
    });
}

// Auto-fill PIN code if in URL parameter ?pin=123456
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pinParam = urlParams.get('pin');
    if (pinParam) {
        document.getElementById('inputPin').value = pinParam;
    }

    renderAvatarPicker();
});

// Render 20 Cute Avatars in Selection Grid
function renderAvatarPicker() {
    const grid = document.getElementById('avatarPickerGrid');
    grid.innerHTML = '';

    AVATARS.forEach((av) => {
        const item = document.createElement('div');
        item.className = `avatar-option ${av.id === selectedAvatarId ? 'selected' : ''}`;
        item.onclick = () => selectAvatar(av.id, item);

        item.innerHTML = `
            ${getAvatarSVG(av.id, 45)}
            <span class="avatar-option-name">${av.name}</span>
        `;

        grid.appendChild(item);
    });
}

function selectAvatar(avatarId, element) {
    selectedAvatarId = avatarId;
    document.querySelectorAll('.avatar-option').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

// Handle Form Submit to Join Game
function handleJoin(e) {
    e.preventDefault();
    const pin = document.getElementById('inputPin').value.trim();
    const name = document.getElementById('inputName').value.trim();

    if (!pin || !name) {
        alert('กรุณากรอกรหัสห้องและชื่อของคุณให้ครบถ้วน');
        return;
    }

    socket.emit('player_join', {
        roomCode: pin,
        nickname: name,
        avatarId: selectedAvatarId
    });
}

// Socket Response: Join Success
socket.on('join_success', ({ roomCode, player }) => {
    myPlayerData = player;

    // Update Header Bar
    document.getElementById('playerHeaderBar').style.display = 'flex';
    document.getElementById('headerAvatarContainer').innerHTML = getAvatarSVG(player.avatarId, 36);
    document.getElementById('headerPlayerName').innerText = player.nickname;
    document.getElementById('headerPlayerScore').innerText = player.score;

    // Update Waiting Lobby Avatar
    document.getElementById('waitingAvatarBox').innerHTML = getAvatarSVG(player.avatarId, 90);

    showPlayerScreen(screenWaiting);
});

// Socket Response: Join Error
socket.on('join_error', (msg) => {
    alert(msg);
});

// 3-Second Prepare Warm-up Countdown for Mobile
socket.on('prepare_question', (data) => {
    document.getElementById('mobileReadyQNum').innerText = data.questionIndex;
    const totalElem = document.getElementById('mobileReadyQTotal');
    if (totalElem) totalElem.innerText = data.totalQuestions;

    const qTextElem = document.getElementById('mobileReadyQText');
    if (qTextElem) qTextElem.innerText = data.question || 'คำถามข้อถัดไป...';

    let count = data.getReadySeconds || 3;
    const numElem = document.getElementById('mobileReadyCountNum');
    numElem.innerText = count;

    clearInterval(playerReadyTimer);
    playerReadyTimer = setInterval(() => {
        count--;
        if (count > 0) {
            numElem.innerText = count;
        } else {
            numElem.innerText = '🔥';
            clearInterval(playerReadyTimer);
        }
    }, 1000);

    showPlayerScreen(screenPlayerGetReady);
});

// Synchronized Start Question from Server
socket.on('start_question', (data) => {
    clearInterval(playerReadyTimer);
    answerSubmitted = false;
    document.getElementById('mobileQNum').innerText = `${data.questionIndex} / ${data.totalQuestions}`;
    document.getElementById('mobileQPreview').innerText = data.question;

    for (let i = 0; i < 4; i++) {
        const btn = document.querySelector(`.mobile-answer-btn:nth-child(${i + 1})`);
        const btnText = document.getElementById(`btnText${i}`);
        if (data.options[i]) {
            btn.style.display = 'flex';
            btnText.innerText = data.options[i];
        } else {
            btn.style.display = 'none';
        }
    }

    showPlayerScreen(screenAnswer);
});

// Send Answer Choice
function sendAnswer(optionIndex) {
    if (answerSubmitted) return;
    answerSubmitted = true;

    socket.emit('player_submit_answer', { optionIndex });
    showPlayerScreen(screenAnsweredWaiting);
}

// Answer Acknowledged by Server
socket.on('answer_received', (data) => {
    showPlayerScreen(screenAnsweredWaiting);
});

// Server Reveals Result for Player
socket.on('question_result', (data) => {
    const feedbackScreen = document.getElementById('screenFeedback');
    const title = document.getElementById('feedbackTitle');
    const icon = document.getElementById('feedbackIcon');
    const detail = document.getElementById('feedbackDetail');
    const pts = document.getElementById('feedbackPts');
    const streakBadge = document.getElementById('streakBadge');
    const streakNum = document.getElementById('streakNum');

    // Update score badge in header
    document.getElementById('headerPlayerScore').innerText = data.totalScore.toLocaleString();
    document.getElementById('mobileTotalScore').innerText = data.totalScore.toLocaleString();

    const shapeIcons = ['▲', '◆', '●', '■'];
    const shapeColors = ['#ff5252', '#448aff', '#ffd700', '#69f0ae'];
    const correctShape = shapeIcons[data.correctIndex] || '✅';
    const correctColor = shapeColors[data.correctIndex] || '#FFD700';

    const correctBoxHtml = `
        <div style="background: rgba(0,0,0,0.4); border: 1px solid rgba(255,215,0,0.35); padding: 14px 20px; border-radius: 20px; margin: 14px 0; text-align: center; box-shadow: inset 0 2px 10px rgba(0,0,0,0.4);">
            <div style="font-size: 0.95rem; color: #d1c4e9; font-weight: 600; margin-bottom: 6px;">🎯 คำตอบที่ถูกต้องคือ:</div>
            <div style="font-size: 1.35rem; font-weight: 800; color: #ffffff; display: flex; align-items: center; justify-content: center; gap: 10px;">
                <span style="color: ${correctColor}; font-size: 1.8rem; filter: drop-shadow(0 2px 8px ${correctColor});">${correctShape}</span>
                <span>${escapeHtml(data.correctOptionText)}</span>
            </div>
        </div>
    `;

    if (data.isCorrect) {
        feedbackScreen.className = 'feedback-screen correct';
        icon.innerText = '🎉';
        title.innerText = 'ตอบถูกต้อง!';
        detail.innerHTML = correctBoxHtml;
        pts.innerText = `+${data.pointsEarned.toLocaleString()} pts`;

        if (data.streak > 1) {
            streakBadge.style.display = 'inline-block';
            streakNum.innerText = data.streak;
        } else {
            streakBadge.style.display = 'none';
        }
    } else {
        feedbackScreen.className = 'feedback-screen wrong';
        icon.innerText = '❌';
        title.innerText = data.answered ? 'ตอบไม่ถูกต้อง!' : 'หมดเวลาตอบ!';
        detail.innerHTML = correctBoxHtml;
        pts.innerText = '+0 pts';
        streakBadge.style.display = 'none';
    }

    showPlayerScreen(feedbackScreen);
});

// Leaderboard Sync Update
socket.on('leaderboard_update', (data) => {
    showPlayerScreen(screenPlayerLeaderboard);
});

// Personal Rank Update from Server (Handles both intermediate leaderboard and final game finish)
function handlePlayerRankUpdate(data) {
    document.getElementById('mobileRankNum').innerText = data.rank;
    document.getElementById('mobileTotalPlayersNum').innerText = data.totalPlayers;
    document.getElementById('mobileTotalScore').innerText = data.score.toLocaleString();
    document.getElementById('mobileFinalAvatarBox').innerHTML = getAvatarSVG(data.avatarId, 90);

    const titleElem = document.getElementById('mobileFinalTitle');
    const badgeElem = document.getElementById('mobileFinalRankBadge');
    const subtextElem = document.getElementById('mobileFinalSubtext');

    if (data.isFinal) {
        // Game Finished -> Show Congratulatory Title & Custom Badges
        if (data.rank === 1) {
            badgeElem.style.background = 'linear-gradient(135deg, #ffd700, #ff8c00)';
            titleElem.innerText = '🥇 ยินดีด้วย! คุณคือผู้ชนะเลิศ!';
        } else if (data.rank <= 3) {
            badgeElem.style.background = 'linear-gradient(135deg, #c0c0c0, #708090)';
            titleElem.innerText = `🏅 ยินดีด้วย! คุณติด Top 3 (อันดับที่ ${data.rank})!`;
        } else if (data.rank <= 5) {
            badgeElem.style.background = 'linear-gradient(135deg, #f093fb, #f5576c)';
            titleElem.innerText = `🎉 ยินดีด้วย! คุณติด Top 5 (อันดับที่ ${data.rank})!`;
        } else {
            badgeElem.style.background = 'linear-gradient(135deg, #667eea, #764ba2)';
            titleElem.innerText = `👏 ขอบคุณที่ร่วมแข่งขัน!`;
        }
        if (subtextElem) subtextElem.innerText = 'การแข่งขันจบลงแล้ว ขอบคุณผู้ร่วมสนุกทุกคน!';
    } else {
        // Intermediate Leaderboard during game -> Clean score & rank update, NO congratulatory messages
        badgeElem.style.background = 'linear-gradient(135deg, #7B1FA2, #5B067C)';
        titleElem.innerText = '📊 อันดับและคะแนนปัจจุบัน';
        if (subtextElem) subtextElem.innerText = 'โปรดมองที่หน้าจอหลัก (Host) เพื่อดูอันดับของทุกคนบนหน้าจอใหญ่!';
    }

    showPlayerScreen(screenPlayerLeaderboard);
}

socket.on('player_rank_update', handlePlayerRankUpdate);
socket.on('player_final_result', handlePlayerRankUpdate);

// Room Closed
socket.on('room_closed', (msg) => {
    alert(msg);
    location.href = 'index.html';
});

function escapeHtml(text) {
    if (!text) return '';
    return text.replace(/[&<>"']/g, function(m) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[m];
    });
}

# 🎮 KADARK - Kahoot-Style Interactive Multiplayer Quiz Platform

ระบบควิซตอบคำถามมัลติเพลเยอร์เรียลไทม์สไตล์ Kahoot พร้อมสแกน QR Code เข้าเล่นผ่านมือถือ เลือก 20 ตัวละคร Avatar สดใส คิดคะแนนตามความเร็วสัมพัทธ์ เสียงเอฟเฟกต์ตื่นเต้น และระบบคลังชุดคำถามบนเซิร์ฟเวอร์

---

## 🌟 ฟีเจอร์หลัก (Key Features)

- 📱 **QR Code & PIN Join**: สแกน QR Code หรือกรอกรหัส PIN 6 หลักเพื่อเข้าร่วมเกมผ่านมือถือได้ทันที
- 🎨 **20 Cute Avatars**: ตัวละครสัตว์น่ารัก 20 แบบให้ผู้เล่นเลือกเป็นตัวแทนตนเอง
- ⚡ **Speed-Based Scoring**: คิดคะแนนตามความเร็วสัมพัทธ์ (ผู้ตอบถูกเร็วที่สุดได้ 1,000 คะแนน, ช้าที่สุดได้ 100 คะแนน)
- 🔊 **Interactive Sound Engine**: เสียงนับถอยหลังตื่นเต้น, เสียงแตรชัยชนะ (สามารถเปิด-ปิดเสียงที่ Host ได้)
- 📊 **Real-time Leaderboard & Podium**: แท่นรับรางวัล 1st, 2nd, 3rd พร้อม confetti และตารางสรุปอันดับผู้เล่นทุกคน
- 🌐 **Server Quiz Repository & Builder**: ระบบสร้าง จัดการ และคลังชุดคำถามส่วนกลางบนเซิร์ฟเวอร์

---

## 🚀 วิธีการติดตั้งและเริ่มใช้งาน (Getting Started)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. เริ่มทำงานเซิร์ฟเวอร์
```bash
npm start
```
หรือ
```bash
node server.js
```

### 3. เข้าใช้งานผ่าน Web Browser
- **Host Screen (สำหรับเปิดขึ้นจอใหญ่)**: `http://localhost:3000/host.html`
- **Player Screen (สำหรับผู้เล่นสแกน/กดเข้าเล่น)**: `http://localhost:3000/player.html`
- **Quiz Editor (สำหรับสร้าง/แก้ไขชุดคำถาม)**: `http://localhost:3000/editor.html`

---

## 🛠️ โครงสร้างโปรเจกต์ (Project Structure)

```
kadark/
├── server.js               # Node.js + Express + Socket.IO Backend Server
├── public/
│   ├── index.html          # Landing Portal Page
│   ├── host.html           # Host View Screen
│   ├── player.html         # Mobile Player View Screen
│   ├── editor.html         # Quiz Builder & Repository Manager
│   ├── css/
│   │   ├── style.css       # PEA Purple & Gold Glassmorphism System
│   │   └── player.css      # Mobile Player Dedicated Stylesheet
│   ├── js/
│   │   ├── host.js         # Host Logic & Socket Events
│   │   ├── player.js       # Mobile Player Logic & Socket Events
│   │   ├── editor.js       # Quiz Builder Logic & Server Repository API
│   │   ├── avatars.js      # Pure Inline SVG Avatars Library (20 Characters)
│   │   └── sound-engine.js # Web Audio API Sound Synthesizer
│   └── data/
│       └── quizzes/        # Server Quiz Repository Storage Directory (JSON)
├── package.json
└── README.md
```

---

## 📄 License
ISC License

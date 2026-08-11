# 🎮 KadArk - Kahoot-Style Interactive Multiplayer Quiz Platform

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

### 4. รันผ่าน Docker / Docker Compose 🐳
```bash
# รันผ่าน Docker Compose (แนะนำ - คำสั่งเดียวจบ)
docker compose up -d

# หรือสร้าง Image และรันด้วย Docker CLI
docker build -t kadark-quiz .
docker run -d -p 3000:3000 --name kadark_app kadark-quiz
```

### 5. การตั้งค่าการเชื่อมต่อ MS SQL Server Database 🗄️
ระบบรองรับการบันทึกข้อมูลคลังชุดคำถามลง **Microsoft SQL Server** (PEA Network DB) โดยตรงผ่านไฟล์ `.env`:

```env
DB_SERVER=c2webdb.pea.co.th
DB_PORT=59156
DB_USER=quizkadark
DB_PASSWORD=quizkadark
DB_NAME=quizkadark
```
- **การสร้างตารางอัตโนมัติ**: เมื่อเริ่มทำงาน ระบบจะสร้างตาราง `Quizzes` และ `Questions` บน SQL Server ให้อัตโนมัติ
- **ระบบสำรองอัตโนมัติ (Fallback)**: หากเซิร์ฟเวอร์ไม่ได้ต่อเครือข่าย PEA หรือฐานข้อมูลขัดข้อง ระบบจะสลับไปใช้ไฟล์สำรอง JSON โดยอัตโนมัติโดยไม่ทำให้เกมหยุดชะงัก

---

## ⚡ การ Deploy ขึ้น Vercel (Vercel Deployment)

โปรเจกต์นี้ได้รับการกำหนดโครงสร้าง **`vercel.json`** และ Serverless Export ไว้อย่างสมบูรณ์แบบเรียบร้อยแล้ว:

1. **Deploy ผ่าน Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```
2. **หรือ Import ผ่าน Vercel Dashboard**:
   - นำโปรเจกต์ขึ้น **GitHub** แล้วกด **Import Project** บนหน้าเว็บ [Vercel.com](https://vercel.com)
   - Vercel จะตรวจพบ `vercel.json` และรัน Build ให้อัตโนมัติทันที
   - ระบบจะสร้าง URL HTTPS (เช่น `https://your-app.vercel.app`) พร้อม QR Code สแกนเข้าเล่นผ่านอินเทอร์เน็ตได้ทันที!

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

// 20 Cute Cartoon Avatars (SVG-based for fast, crisp, offline rendering)

const AVATARS = [
    { id: 'cat', name: 'น้องแมวส้ม', bg: '#FFE8D6' },
    { id: 'bunny', name: 'น้องกระต่ายพิงค์', bg: '#FFD6E0' },
    { id: 'bear', name: 'พี่หมีบราวน์', bg: '#E8D8C8' },
    { id: 'panda', name: 'น้องแพนด้า', bg: '#E2ECE9' },
    { id: 'fox', name: 'จิ้งจอกส้ม', bg: '#FFD8BE' },
    { id: 'koala', name: 'โคอาล่าเทา', bg: '#E0E7ED' },
    { id: 'penguin', name: 'เพนกวินจิ๋ว', bg: '#D0E1FD' },
    { id: 'puppy', name: 'ชิบะน้อย', bg: '#FFE5B4' },
    { id: 'frog', name: 'กบเขียวสดใส', bg: '#D8F3DC' },
    { id: 'piggy', name: 'หมูน้อยสีชมพู', bg: '#FFC8DD' },
    { id: 'owl', name: 'นกฮูกตาโต', bg: '#EDE0D4' },
    { id: 'hamster', name: 'แฮมสเตอร์แก้มอม', bg: '#FFF3B0' },
    { id: 'unicorn', name: 'ยูนิคอร์นพาสเทล', bg: '#F3C4FB' },
    { id: 'chick', name: 'ลูกเจี๊ยบเหลือง', bg: '#FFF176' },
    { id: 'monkey', name: 'ลิงน้อยซน', bg: '#E6CCB2' },
    { id: 'lion', name: 'สิงโตจิ๋ว', bg: '#FFE082' },
    { id: 'tiger', name: 'เสือน้อย', bg: '#FFB74D' },
    { id: 'elephant', name: 'ช้างน้อยฟ้า', bg: '#B39DDB' },
    { id: 'axolotl', name: 'อั๊กโซลอตล์', bg: '#F8BBD0' },
    { id: 'dragon', name: 'มังกรจิ๋วเขียว', bg: '#C8E6C9' }
];

function getAvatarSVG(id, size = 80) {
    const avatar = AVATARS.find(a => a.id === id) || AVATARS[0];
    let content = '';

    switch (id) {
        case 'cat':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <polygon points="20,30 32,5 42,28" fill="#FF8C42"/>
                <polygon points="23,28 32,10 39,26" fill="#FFB703"/>
                <polygon points="80,30 68,5 58,28" fill="#FF8C42"/>
                <polygon points="77,28 68,10 61,26" fill="#FFB703"/>
                <ellipse cx="50" cy="55" rx="32" ry="28" fill="#FFA559"/>
                <ellipse cx="38" cy="50" rx="4.5" ry="6" fill="#2B2D42"/>
                <ellipse cx="62" cy="50" rx="4.5" ry="6" fill="#2B2D42"/>
                <circle cx="40" cy="48" r="1.5" fill="#FFF"/>
                <circle cx="64" cy="48" r="1.5" fill="#FFF"/>
                <ellipse cx="30" cy="58" rx="5" ry="3" fill="#FF6B6B" opacity="0.6"/>
                <ellipse cx="70" cy="58" rx="5" ry="3" fill="#FF6B6B" opacity="0.6"/>
                <polygon points="50,56 46,53 54,53" fill="#FF6B81"/>
                <path d="M 46 59 Q 50 63 54 59" stroke="#2B2D42" stroke-width="2.5" fill="none" stroke-linecap="round"/>
                <line x1="18" y1="52" x2="30" y2="54" stroke="#2B2D42" stroke-width="2"/>
                <line x1="18" y1="60" x2="30" y2="58" stroke="#2B2D42" stroke-width="2"/>
                <line x1="82" y1="52" x2="70" y2="54" stroke="#2B2D42" stroke-width="2"/>
                <line x1="82" y1="60" x2="70" y2="58" stroke="#2B2D42" stroke-width="2"/>
            `;
            break;
        case 'bunny':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <ellipse cx="35" cy="22" rx="9" ry="20" fill="#FFF" stroke="#FF85A1" stroke-width="3"/>
                <ellipse cx="35" cy="22" rx="5" ry="14" fill="#FF85A1"/>
                <ellipse cx="65" cy="22" rx="9" ry="20" fill="#FFF" stroke="#FF85A1" stroke-width="3"/>
                <ellipse cx="65" cy="22" rx="5" ry="14" fill="#FF85A1"/>
                <ellipse cx="50" cy="58" rx="30" ry="26" fill="#FFF"/>
                <circle cx="38" cy="54" r="4.5" fill="#3D3A45"/>
                <circle cx="62" cy="54" r="4.5" fill="#3D3A45"/>
                <circle cx="39.5" cy="52.5" r="1.5" fill="#FFF"/>
                <circle cx="63.5" cy="52.5" r="1.5" fill="#FFF"/>
                <ellipse cx="30" cy="62" rx="5" ry="3" fill="#FF94B8" opacity="0.6"/>
                <ellipse cx="70" cy="62" rx="5" ry="3" fill="#FF94B8" opacity="0.6"/>
                <polygon points="50,60 47,57 53,57" fill="#FF6584"/>
                <path d="M 46 64 Q 50 67 54 64" stroke="#3D3A45" stroke-width="2" fill="none"/>
            `;
            break;
        case 'bear':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="25" cy="25" r="12" fill="#7F5539"/>
                <circle cx="25" cy="25" r="6" fill="#DDB892"/>
                <circle cx="75" cy="25" r="12" fill="#7F5539"/>
                <circle cx="75" cy="25" r="6" fill="#DDB892"/>
                <circle cx="50" cy="56" r="30" fill="#9C6644"/>
                <ellipse cx="50" cy="63" rx="16" ry="13" fill="#EDE0D4"/>
                <circle cx="38" cy="50" r="4.5" fill="#212529"/>
                <circle cx="62" cy="50" r="4.5" fill="#212529"/>
                <circle cx="39.5" cy="48.5" r="1.5" fill="#FFF"/>
                <circle cx="63.5" cy="48.5" r="1.5" fill="#FFF"/>
                <ellipse cx="50" cy="59" rx="6" ry="4" fill="#212529"/>
                <path d="M 46 65 Q 50 69 54 65" stroke="#212529" stroke-width="2" fill="none"/>
            `;
            break;
        case 'panda':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="24" cy="24" r="13" fill="#212529"/>
                <circle cx="76" cy="24" r="13" fill="#212529"/>
                <circle cx="50" cy="55" r="32" fill="#FFF"/>
                <ellipse cx="36" cy="52" rx="10" ry="12" fill="#212529" transform="rotate(-15 36 52)"/>
                <ellipse cx="64" cy="52" rx="10" ry="12" fill="#212529" transform="rotate(15 64 52)"/>
                <circle cx="37" cy="51" r="4" fill="#FFF"/>
                <circle cx="63" cy="51" r="4" fill="#FFF"/>
                <circle cx="38" cy="52" r="2" fill="#212529"/>
                <circle cx="62" cy="52" r="2" fill="#212529"/>
                <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="#212529"/>
                <path d="M 46 67 Q 50 70 54 67" stroke="#212529" stroke-width="2" fill="none"/>
                <ellipse cx="26" cy="62" rx="4" ry="2.5" fill="#FF85A1" opacity="0.6"/>
                <ellipse cx="74" cy="62" rx="4" ry="2.5" fill="#FF85A1" opacity="0.6"/>
            `;
            break;
        case 'fox':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <polygon points="18,35 30,8 45,35" fill="#E65100"/>
                <polygon points="24,32 30,14 40,32" fill="#212529"/>
                <polygon points="82,35 70,8 55,35" fill="#E65100"/>
                <polygon points="76,32 70,14 60,32" fill="#212529"/>
                <polygon points="15,48 50,85 85,48" fill="#F57C00"/>
                <polygon points="15,48 50,85 50,48" fill="#FFF"/>
                <polygon points="85,48 50,85 50,48" fill="#FFF"/>
                <circle cx="35" cy="48" r="4.5" fill="#212529"/>
                <circle cx="65" cy="48" r="4.5" fill="#212529"/>
                <circle cx="36.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="66.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="50" cy="82" r="5" fill="#212529"/>
            `;
            break;
        case 'koala':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="20" cy="30" r="16" fill="#90A4AE"/>
                <circle cx="20" cy="30" r="10" fill="#CFD8DC"/>
                <circle cx="80" cy="30" r="16" fill="#90A4AE"/>
                <circle cx="80" cy="30" r="10" fill="#CFD8DC"/>
                <circle cx="50" cy="56" r="30" fill="#B0BEC5"/>
                <circle cx="36" cy="50" r="4" fill="#263238"/>
                <circle cx="64" cy="50" r="4" fill="#263238"/>
                <circle cx="37" cy="48.5" r="1.5" fill="#FFF"/>
                <circle cx="65" cy="48.5" r="1.5" fill="#FFF"/>
                <ellipse cx="50" cy="58" rx="8" ry="14" fill="#37474F"/>
                <ellipse cx="28" cy="62" rx="4" ry="2.5" fill="#FF8A80" opacity="0.6"/>
                <ellipse cx="72" cy="62" rx="4" ry="2.5" fill="#FF8A80" opacity="0.6"/>
            `;
            break;
        case 'penguin':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <ellipse cx="50" cy="55" rx="32" ry="30" fill="#263238"/>
                <ellipse cx="50" cy="58" rx="24" ry="24" fill="#FFF"/>
                <circle cx="38" cy="48" r="4" fill="#263238"/>
                <circle cx="62" cy="48" r="4" fill="#263238"/>
                <circle cx="39.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="63.5" cy="46.5" r="1.5" fill="#FFF"/>
                <polygon points="50,50 43,58 57,58" fill="#FF9800"/>
                <ellipse cx="30" cy="58" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
                <ellipse cx="70" cy="58" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
            `;
            break;
        case 'puppy':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <ellipse cx="20" cy="42" rx="9" ry="18" fill="#D7CCC8" transform="rotate(20 20 42)"/>
                <ellipse cx="80" cy="42" rx="9" ry="18" fill="#D7CCC8" transform="rotate(-20 80 42)"/>
                <circle cx="50" cy="55" r="30" fill="#E0D7C6"/>
                <ellipse cx="50" cy="63" rx="15" ry="11" fill="#FFF"/>
                <circle cx="37" cy="49" r="4.5" fill="#3E2723"/>
                <circle cx="63" cy="49" r="4.5" fill="#3E2723"/>
                <circle cx="38.5" cy="47.5" r="1.5" fill="#FFF"/>
                <circle cx="64.5" cy="47.5" r="1.5" fill="#FFF"/>
                <ellipse cx="50" cy="58" rx="5" ry="3.5" fill="#3E2723"/>
                <path d="M 48 64 Q 50 72 52 64" fill="#FF5252"/>
            `;
            break;
        case 'frog':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="30" cy="28" r="14" fill="#66BB6A"/>
                <circle cx="30" cy="28" r="9" fill="#FFF"/>
                <circle cx="30" cy="28" r="5" fill="#1B5E20"/>
                <circle cx="32" cy="26" r="2" fill="#FFF"/>
                <circle cx="70" cy="28" r="14" fill="#66BB6A"/>
                <circle cx="70" cy="28" r="9" fill="#FFF"/>
                <circle cx="70" cy="28" r="5" fill="#1B5E20"/>
                <circle cx="72" cy="26" r="2" fill="#FFF"/>
                <ellipse cx="50" cy="58" rx="35" ry="26" fill="#81C784"/>
                <ellipse cx="50" cy="64" rx="22" ry="16" fill="#C8E6C9"/>
                <ellipse cx="26" cy="60" rx="5" ry="3" fill="#FF4081" opacity="0.6"/>
                <ellipse cx="74" cy="60" rx="5" ry="3" fill="#FF4081" opacity="0.6"/>
                <path d="M 36 60 Q 50 72 64 60" stroke="#1B5E20" stroke-width="3" fill="none" stroke-linecap="round"/>
            `;
            break;
        case 'piggy':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <polygon points="18,30 30,12 38,32" fill="#F48FB1"/>
                <polygon points="82,30 70,12 62,32" fill="#F48FB1"/>
                <circle cx="50" cy="56" r="31" fill="#F8BBD0"/>
                <circle cx="36" cy="48" r="4" fill="#880E4F"/>
                <circle cx="64" cy="48" r="4" fill="#880E4F"/>
                <circle cx="37.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="65.5" cy="46.5" r="1.5" fill="#FFF"/>
                <ellipse cx="50" cy="60" rx="11" ry="8" fill="#F48FB1"/>
                <circle cx="45" cy="60" r="2.5" fill="#AD1457"/>
                <circle cx="55" cy="60" r="2.5" fill="#AD1457"/>
                <ellipse cx="25" cy="60" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
                <ellipse cx="75" cy="60" rx="4" ry="2.5" fill="#FF4081" opacity="0.6"/>
            `;
            break;
        case 'owl':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <polygon points="25,25 35,10 42,28" fill="#8D6E63"/>
                <polygon points="75,25 65,10 58,28" fill="#8D6E63"/>
                <ellipse cx="50" cy="55" rx="30" ry="28" fill="#A1887F"/>
                <circle cx="35" cy="46" r="12" fill="#FFF"/>
                <circle cx="35" cy="46" r="6" fill="#3E2723"/>
                <circle cx="37" cy="44" r="2" fill="#FFF"/>
                <circle cx="65" cy="46" r="12" fill="#FFF"/>
                <circle cx="65" cy="46" r="6" fill="#3E2723"/>
                <circle cx="67" cy="44" r="2" fill="#FFF"/>
                <polygon points="50,48 45,56 55,56" fill="#FFB300"/>
                <path d="M 40 68 Q 45 74 50 68 Q 55 74 60 68" stroke="#5D4037" stroke-width="2" fill="none"/>
            `;
            break;
        case 'hamster':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="24" cy="26" r="9" fill="#FFD54F"/>
                <circle cx="24" cy="26" r="5" fill="#FF8A80"/>
                <circle cx="76" cy="26" r="9" fill="#FFD54F"/>
                <circle cx="76" cy="26" r="5" fill="#FF8A80"/>
                <ellipse cx="50" cy="56" rx="32" ry="28" fill="#FFE082"/>
                <ellipse cx="50" cy="62" rx="20" ry="18" fill="#FFF"/>
                <circle cx="26" cy="60" r="10" fill="#FFECB3"/>
                <circle cx="74" cy="60" r="10" fill="#FFECB3"/>
                <circle cx="37" cy="49" r="4" fill="#3E2723"/>
                <circle cx="63" cy="49" r="4" fill="#3E2723"/>
                <circle cx="38.5" cy="47.5" r="1.5" fill="#FFF"/>
                <circle cx="64.5" cy="47.5" r="1.5" fill="#FFF"/>
                <polygon points="50,54 47,51 53,51" fill="#FF8A80"/>
                <ellipse cx="25" cy="61" rx="4" ry="2.5" fill="#FF5252" opacity="0.6"/>
                <ellipse cx="75" cy="61" rx="4" ry="2.5" fill="#FF5252" opacity="0.6"/>
            `;
            break;
        case 'unicorn':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <polygon points="50,5 44,28 56,28" fill="#FFD700"/>
                <line x1="47" y1="20" x2="53" y2="20" stroke="#FF4081" stroke-width="2"/>
                <line x1="45" y1="12" x2="55" y2="12" stroke="#00E5FF" stroke-width="2"/>
                <polygon points="25,28 35,12 42,28" fill="#FFF" stroke="#E040FB" stroke-width="2"/>
                <polygon points="75,28 65,12 58,28" fill="#FFF" stroke="#E040FB" stroke-width="2"/>
                <ellipse cx="50" cy="58" rx="28" ry="25" fill="#FFF"/>
                <path d="M 32 52 Q 38 58 44 52" stroke="#7C4DFF" stroke-width="3" fill="none" stroke-linecap="round"/>
                <path d="M 56 52 Q 62 58 68 52" stroke="#7C4DFF" stroke-width="3" fill="none" stroke-linecap="round"/>
                <ellipse cx="30" cy="60" rx="5" ry="3" fill="#FF80AB" opacity="0.7"/>
                <ellipse cx="70" cy="60" rx="5" ry="3" fill="#FF80AB" opacity="0.7"/>
                <polygon points="50,62 48,60 52,60" fill="#FF80AB"/>
            `;
            break;
        case 'chick':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <path d="M 50 18 Q 45 10 48 24" stroke="#FBC02D" stroke-width="3" fill="none"/>
                <path d="M 50 18 Q 55 10 52 24" stroke="#FBC02D" stroke-width="3" fill="none"/>
                <circle cx="50" cy="55" r="30" fill="#FFF59D"/>
                <circle cx="36" cy="48" r="4" fill="#212121"/>
                <circle cx="64" cy="48" r="4" fill="#212121"/>
                <circle cx="37.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="65.5" cy="46.5" r="1.5" fill="#FFF"/>
                <polygon points="50,48 42,56 58,56" fill="#FF9800"/>
                <ellipse cx="27" cy="58" rx="5" ry="3" fill="#FF7043" opacity="0.6"/>
                <ellipse cx="73" cy="58" rx="5" ry="3" fill="#FF7043" opacity="0.6"/>
            `;
            break;
        case 'monkey':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="18" cy="45" r="12" fill="#8D6E63"/>
                <circle cx="18" cy="45" r="7" fill="#D7CCC8"/>
                <circle cx="82" cy="45" r="12" fill="#8D6E63"/>
                <circle cx="82" cy="45" r="7" fill="#D7CCC8"/>
                <circle cx="50" cy="52" r="30" fill="#6D4C41"/>
                <path d="M 30 45 C 30 35 45 35 50 42 C 55 35 70 35 70 45 C 70 65 30 65 30 45 Z" fill="#F5E0C3"/>
                <circle cx="40" cy="48" r="4" fill="#212529"/>
                <circle cx="60" cy="48" r="4" fill="#212529"/>
                <ellipse cx="50" cy="56" rx="4" ry="2.5" fill="#3E2723"/>
                <path d="M 44 60 Q 50 65 56 60" stroke="#3E2723" stroke-width="2" fill="none"/>
            `;
            break;
        case 'lion':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="50" cy="52" r="38" fill="#E65100"/>
                <circle cx="50" cy="54" r="27" fill="#FFB74D"/>
                <circle cx="26" cy="34" r="7" fill="#FFB74D"/>
                <circle cx="74" cy="34" r="7" fill="#FFB74D"/>
                <circle cx="38" cy="48" r="4" fill="#212529"/>
                <circle cx="62" cy="48" r="4" fill="#212529"/>
                <circle cx="39.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="63.5" cy="46.5" r="1.5" fill="#FFF"/>
                <polygon points="50,55 45,51 55,51" fill="#BF360C"/>
                <path d="M 46 60 Q 50 64 54 60" stroke="#BF360C" stroke-width="2" fill="none"/>
            `;
            break;
        case 'tiger':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <circle cx="24" cy="26" r="9" fill="#F57C00"/>
                <circle cx="24" cy="26" r="5" fill="#212529"/>
                <circle cx="76" cy="26" r="9" fill="#F57C00"/>
                <circle cx="76" cy="26" r="5" fill="#212529"/>
                <circle cx="50" cy="55" r="31" fill="#FF9800"/>
                <polygon points="50,26 47,34 53,34" fill="#212529"/>
                <polygon points="22,50 30,48 24,54" fill="#212529"/>
                <polygon points="78,50 70,48 76,54" fill="#212529"/>
                <ellipse cx="50" cy="62" rx="14" ry="10" fill="#FFF"/>
                <circle cx="37" cy="49" r="4" fill="#212529"/>
                <circle cx="63" cy="49" r="4" fill="#212529"/>
                <polygon points="50,58 46,55 54,55" fill="#E91E63"/>
                <path d="M 46 64 Q 50 67 54 64" stroke="#212529" stroke-width="2" fill="none"/>
            `;
            break;
        case 'elephant':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <ellipse cx="16" cy="45" rx="14" ry="20" fill="#90CAF9"/>
                <ellipse cx="84" cy="45" rx="14" ry="20" fill="#90CAF9"/>
                <circle cx="50" cy="52" r="28" fill="#64B5F6"/>
                <circle cx="37" cy="46" r="4" fill="#1565C0"/>
                <circle cx="63" cy="46" r="4" fill="#1565C0"/>
                <circle cx="38.5" cy="44.5" r="1.5" fill="#FFF"/>
                <circle cx="64.5" cy="44.5" r="1.5" fill="#FFF"/>
                <path d="M 50 54 Q 50 72 62 65 Q 64 60 58 60" stroke="#64B5F6" stroke-width="8" fill="none" stroke-linecap="round"/>
                <ellipse cx="28" cy="56" rx="4" ry="2.5" fill="#FF4081" opacity="0.5"/>
                <ellipse cx="72" cy="56" rx="4" ry="2.5" fill="#FF4081" opacity="0.5"/>
            `;
            break;
        case 'axolotl':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <path d="M 24 40 C 10 32 12 45 22 48" stroke="#FF4081" stroke-width="3.5" fill="none"/>
                <path d="M 24 50 C 8 50 10 60 22 56" stroke="#FF4081" stroke-width="3.5" fill="none"/>
                <path d="M 76 40 C 90 32 88 45 78 48" stroke="#FF4081" stroke-width="3.5" fill="none"/>
                <path d="M 76 50 C 92 50 90 60 78 56" stroke="#FF4081" stroke-width="3.5" fill="none"/>
                <ellipse cx="50" cy="54" rx="30" ry="24" fill="#F8BBD0"/>
                <circle cx="36" cy="48" r="4.5" fill="#880E4F"/>
                <circle cx="64" cy="48" r="4.5" fill="#880E4F"/>
                <circle cx="37.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="65.5" cy="46.5" r="1.5" fill="#FFF"/>
                <ellipse cx="28" cy="56" rx="5" ry="3" fill="#FF4081" opacity="0.6"/>
                <ellipse cx="72" cy="56" rx="5" ry="3" fill="#FF4081" opacity="0.6"/>
                <path d="M 42 56 Q 50 64 58 56" stroke="#880E4F" stroke-width="2.5" fill="none" stroke-linecap="round"/>
            `;
            break;
        case 'dragon':
            content = `
                <circle cx="50" cy="50" r="45" fill="${avatar.bg}"/>
                <polygon points="34,22 28,8 40,18" fill="#FFD54F"/>
                <polygon points="66,22 72,8 60,18" fill="#FFD54F"/>
                <ellipse cx="50" cy="54" rx="29" ry="26" fill="#81C784"/>
                <ellipse cx="50" cy="62" rx="16" ry="12" fill="#DCEDC8"/>
                <circle cx="37" cy="48" r="4.5" fill="#1B5E20"/>
                <circle cx="63" cy="48" r="4.5" fill="#1B5E20"/>
                <circle cx="38.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="64.5" cy="46.5" r="1.5" fill="#FFF"/>
                <circle cx="45" cy="58" r="1.5" fill="#33691E"/>
                <circle cx="55" cy="58" r="1.5" fill="#33691E"/>
                <path d="M 44 64 Q 50 68 56 64" stroke="#33691E" stroke-width="2" fill="none"/>
            `;
            break;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="avatar-svg">${content}</svg>`;
}

function getAvatarInfo(id) {
    return AVATARS.find(a => a.id === id) || AVATARS[0];
}

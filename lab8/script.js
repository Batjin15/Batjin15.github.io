// ####################################################################
// # 1. ҮНДСЭН МЭДЭЭЛЭЛ БА ХУВЬСАГЧУУД
// ####################################################################

// **Асуулт Хариултын Массив** (Лекцийн сэдэвтэй холбоотой)
// (Жишээ: IP хаяг, Сервер, HTTP, Domain, Browser гэх мэт нэр томьёог ашигласан)
const qaPairs = [
    { question: "Вэб хуудсыг харуулах програм хангамж?", answer: "BROWSER" },
    { question: "Вэб хуудсыг хүсэлтээр илгээдэг алсын компьютер?", answer: "SERVER" },
    { question: "Вэб хуудас дамжуулах протокол (Үндсэн протокол)?", answer: "HTTP" },
    { question: "Интернетэд төхөөрөмжийг таних тоон хаяг?", answer: "IPADDRESS" },
    { question: "Вэб хуудасны контентийг бүтцэлдэг тэмдэглэгээний хэл?", answer: "HTML" },
    { question: "Вэб хуудасны загварыг тодорхойлдог код?", answer: "CSS" }
];

// Тоглоомын төлөвийг хадгалах хувьсагчууд
let currentAnswer = ""; // Сонгогдсон нууц үг (жишээ: "SERVER")
let guessedWord = [];   // Одоогоор таасан үг ('S', '_', 'R', 'V', 'E', 'R')
let mistakes = 0;       // Буруу таасан тоо (0-7)
const maxMistakes = 7;  // Зөвшөөрөгдөх дээд алдаа
let isGameActive = false; // Тоглоом идэвхтэй байгаа эсэх

// HTML элементүүдийг сонгож авах
const startButton = document.getElementById('startButton');
const questionDisplay = document.getElementById('questionDisplay');
const answerDisplay = document.getElementById('answerDisplay');
const keyboardDiv = document.getElementById('keyboard');
const messageDisplay = document.getElementById('messageDisplay');

// Дэгжлүүр зургийн Canvas
const canvas = document.getElementById('hangmanCanvas');
const ctx = canvas.getContext('2d');
// # 2. ТОГЛООМЫН ҮНДСЭН ҮЙЛ АЖИЛЛАГААНЫ ФУНКЦҮҮД
/**
 * Тоглоомыг эхлүүлж,j бүх төлөвийг анхны байдалд оруулна.
 */
function initializeGame() {
    // 1. Төлөвийг шинэчлэх
    mistakes = 0;
    guessedWord = [];
    isGameActive = true;
    messageDisplay.textContent = ''; // Мэссежийг цэвэрлэх
    messageDisplay.className = 'message'; // Загварыг цэвэрлэх
    startButton.textContent = '🎲 Дахин Эхлэх';

    // 2. Асуулт/Хариултыг санамсаргүйгээр сонгох
    const randomIndex = Math.floor(Math.random() * qaPairs.length);
    const selectedPair = qaPairs[randomIndex];
    
    // Хариултыг үргэлж ТОМ ҮСГЭЭР хадгалах нь логикт хялбар (Case-Insensitive)
    currentAnswer = selectedPair.answer.toUpperCase(); 

    // 3. Таах үгийг зураасаар ('_') дүүргэх
    for (let i = 0; i < currentAnswer.length; i++) {
        // Хэрэв хариултад зай (SPACE) эсвэл зураас (HYPHEN) байгаа бол шууд харуулна
        if (currentAnswer[i] === ' ' || currentAnswer[i] === '-') {
            guessedWord.push(currentAnswer[i]);
        } else {
            guessedWord.push('_');
        }
    }
    // 4. Дэлгэц дээр мэдээллийг шинэчлэх
    questionDisplay.textContent = `Сэжүүр: ${selectedPair.question}`;
    updateAnswerDisplay(); // Дэлгэц дээрх хариултыг шинэчлэх
    drawHangman();        // Дэгжлүүрийн зургийг цэвэрлэх
    createKeyboard();     // Үсгийн товчнуудыг шинээр үүсгэх
}

/**
 * Хариултыг дэлгэцэнд шинэчилж харуулна.
 */
function updateAnswerDisplay() {
    // Массивын элементүүдийг зайгаар (space) тусгаарлан нэгтгэх
    answerDisplay.textContent = guessedWord.join(' ');
}

/**
 * Үсэг таах үйлдлийг хийх үндсэн функц.
 * @param {string} letter - Тоглогчийн таасан үсэг.
 */
function handleGuess(letter) {
    if (!isGameActive) return; // Хэрэв тоглоом дууссан бол юу ч хийхгүй

    // 1. Үсгийг олох
    let found = false;
    for (let i = 0; i < currentAnswer.length; i++) {
        if (currentAnswer[i] === letter) {
            guessedWord[i] = letter; // Зөв таасан бол зураасыг үсгээр солих
            found = true;
        }
    }

    // 2. Үр дүнг шалгах
    if (found) {
        updateAnswerDisplay();
        checkWinCondition();
    } else {
        mistakes++; // Буруу таасан бол алдааны тоог нэмэгдүүлэх
        drawHangman(); // Дэгжлүүрийн нэг хэсгийг нэмж зурах
        checkLoseCondition();
    }
}

/**
 * Хожсон эсэхийг шалгах.
 */
function checkWinCondition() {
    // Хэрэв guessedWord массив дотор ' _ ' байхгүй бол бүх үсгийг таасан гэсэн үг.
    if (!guessedWord.includes('_')) {
        isGameActive = false;
        messageDisplay.textContent = '🎉 ТА ХОЖЛОО! Баяр хүргэе!';
        messageDisplay.classList.add('win');
        disableAllButtons();
    }
}

/**
 * Алдсан эсэхийг шалгах.
 */
function checkLoseCondition() {
    if (mistakes >= maxMistakes) {
        isGameActive = false;
        messageDisplay.textContent = `☠️ ТА АЛДСАН! Нууц үг: ${currentAnswer}`;
        messageDisplay.classList.add('lose');
        drawHangman(true); // Сүүлийн хэсгийг зурж дуусгах
        disableAllButtons();
    }
}

/**
 * Бүх үсгийн товчнуудыг идэвхгүй болгох (Тоглоом дууссаны дараа).
 */
function disableAllButtons() {
    const buttons = keyboardDiv.querySelectorAll('.letter-button');
    buttons.forEach(button => {
        button.disabled = true;
    });
}


// ####################################################################
// # 3. ҮСГИЙН ДЭГЖЛҮҮР (KEYBOARD) ҮҮСГЭХ
// ####################################################################

/**
 * Дэлгэцэн дээрх үсгийн товчнуудыг үүсгэнэ.
 */
function createKeyboard() {
    // Хуучин үсгийн товчнуудыг цэвэрлэх
    keyboardDiv.innerHTML = ''; 

    // Латин цагаан толгойн үсгүүдийг сонгох (Интернет технологийн нэр томьёо ихэвчлэн латинаар байдаг)
    // ASCII кодоор А (65)-аас Z (90) хүртэл үсгийг үүсгэнэ.
    for (let i = 65; i <= 90; i++) {
        const letter = String.fromCharCode(i); // i-р кодын үсгийг авах

        const button = document.createElement('button');
        button.textContent = letter;
        button.className = 'letter-button';
        
        // Товчийг дарах үйлдэл
        button.addEventListener('click', function() {
            // Дарсан үсгийг таах функц руу дамжуулах
            handleGuess(letter);
            
            // Дарсан товчийг идэвхгүй болгох
            button.disabled = true; 
        });

        keyboardDiv.appendChild(button);
    }
}


// ####################################################################
// # 4. ДЭГЖЛҮҮР ЗУРАХ (CANVAS)
// ####################################################################

/**
 * Дэгжлүүрийн зургийг алдааны тооноос хамааруулан зурах.
 * 
 */
function drawHangman(isGameOver = false) {
    // Зургийн хэв маягийг тохируулах
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round'; // Муруй хэлбэрээр төгсгөх

    // Тоглоом эхлэх бүрт Canvas-ийг цэвэрлэх
    if (mistakes === 0) {
        ctx.clearRect(0, 0, canvas.width, canvas.height); 
        // 0. Суурь зурах (Draw the base)
        ctx.beginPath();
        ctx.moveTo(10, 240);
        ctx.lineTo(190, 240);
        ctx.stroke();
    }

    // Алдааны тооноос хамааран нэг нэгээр зурна
    switch (mistakes) {
        case 1: // 1. Босоо шон
            ctx.beginPath();
            ctx.moveTo(30, 240);
            ctx.lineTo(30, 10);
            ctx.stroke();
            break;
        case 2: // 2. Хөндлөн шон
            ctx.lineTo(150, 10);
            ctx.stroke();
            break;
        case 3: // 3. Оосор
            ctx.lineTo(150, 30);
            ctx.stroke();
            break;
        case 4: // 4. Толгой (Circle)
            ctx.beginPath();
            ctx.arc(150, 50, 20, 0, Math.PI * 2, true);
            ctx.stroke();
            break;
        case 5: // 5. Бие
            ctx.beginPath();
            ctx.moveTo(150, 70);
            ctx.lineTo(150, 150);
            ctx.stroke();
            break;
        case 6: // 6. Зүүн гар
            ctx.beginPath();
            ctx.moveTo(150, 80);
            ctx.lineTo(120, 120);
            ctx.stroke();
            break;
        case 7: // 7. Баруун гар ба ХӨЛ
            // Баруун гар
            ctx.beginPath();
            ctx.moveTo(150, 80);
            ctx.lineTo(180, 120);
            ctx.stroke();
            // Зүүн хөл
            ctx.beginPath();
            ctx.moveTo(150, 150);
            ctx.lineTo(120, 200);
            ctx.stroke();
            // Баруун хөл (Хэрэв тоглоом дуусвал сүүлийн хэсэг)
            if (isGameOver) {
                 ctx.beginPath();
                 ctx.moveTo(150, 150);
                 ctx.lineTo(180, 200);
                 ctx.stroke();
            }
            break;
        default:
            // 8-р алдаа (total 7 parts)
            if (isGameOver) {
                // Нүдийг X-ээр зурах (Алдсан гэсэн утгатай)
                ctx.strokeStyle = 'red';
                ctx.lineWidth = 3;
                // Зүүн нүд
                ctx.beginPath();
                ctx.moveTo(140, 45);
                ctx.lineTo(150, 55);
                ctx.moveTo(150, 45);
                ctx.lineTo(140, 55);
                ctx.stroke();
                // Баруун нүд
                ctx.beginPath();
                ctx.moveTo(160, 45);
                ctx.lineTo(170, 55);
                ctx.moveTo(170, 45);
                ctx.lineTo(160, 55);
                ctx.stroke();
            }
    }
}


// ####################################################################
// # 5. ҮЙЛДЛИЙН СОНСОГЧ (EVENT LISTENERS)
// ####################################################################

// Тоглоом эхлэх товчийг дарахад тоглоомыг эхлүүлэх
startButton.addEventListener('click', initializeGame);

// Тоглоомыг анх ачаалагдахад зөвхөн суурийг зурна
window.onload = function() {
    drawHangman();
    // Эхлэхээс өмнө keyboard-ийг үүсгээд, үйлдэлгүй болгоно
    createKeyboard(); 
    disableAllButtons();
};
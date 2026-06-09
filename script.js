// Dummy Questions (will be replaced with real ones later)
const questions = [
    "1. Open your passport to the page with your photo 2. Hold the passport in front of your face for 3 seconds then move the passport next to your face (no more than 20cm away from your face) 3. Read the following words out loud: Hocus-pocus, Jibber-jabber, Babbling This helps us to confirm your ID.",
    "Please read the following statement out loud:\n\nI confirm that I understand the seriousness of this interview process and acknowledge that any instance of cheating, attempted deception, or fraud on my part will result in the withdrawal of my admission offer, reporting to the relevant authorities, and possible loss of my deposit.",
    "How did the reputation and ranking of the other universities you considered influence your decision-making process?",
    "How do you plan to manage your financial obligations, such as rent, utilities, and transportation costs, while studying?",
    "What aspects of the university's campus and facilities do you find most appealing?",
    "What do you find most appealing about the curriculum and structure of your chosen course?",
    "How do you plan to adapt your time management and organizational skills to succeed both academically and professionally while in the UK?",
    "Can you discuss the main factors that led you to prioritize this university over others?",
    "What is one country in the world you would love to visit and why?",
    "Which other universities were you considering before finalizing your decision and why?",
    "Have you researched the cost of living in the city where your university is located, and how have you adjusted your budget accordingly?",
    "Do you have a contingency plan in case of unforeseen expenses or financial emergencies during your time in the UK?",
    "How do the teaching style, faculty, or course at this university match your learning goals?",
    "What skills and qualifications do you possess that would make you a competitive candidate for part-time work in the UK?",
    "How do you plan to maintain a healthy lifestyle, including exercise and nutrition, while studying in the UK?",
    "What are the benefits or disadvantages of taking a gap year after you have graduated compared to getting straight into the world of work?",
    "How do you handle stress and maintain a balance between your studies and personal life?"
];

// Application State
let currentQuestion = 0;
let mediaRecorder = null;
let recordedChunks = [];
let stream = null;
let prepTimer = null;
let recordTimer = null;
let savedVideos = [];

// DOM Elements
const startPage = document.getElementById('startPage');
const interviewPage = document.getElementById('interviewPage');
const completionPage = document.getElementById('completionPage');
const startBtn = document.getElementById('startBtn');
const questionNumber = document.getElementById('questionNumber');
const questionText = document.getElementById('questionText');
const prepPhase = document.getElementById('prepPhase');
const recordPhase = document.getElementById('recordPhase');
const submitPhase = document.getElementById('submitPhase');
const submittedPhase = document.getElementById('submittedPhase');
const startPrepBtn = document.getElementById('startPrepBtn');
const submitBtn = document.getElementById('submitBtn');
const restartBtn = document.getElementById('restartBtn');
const prepTimer_el = document.getElementById('prepTimer');
const recordTimer_el = document.getElementById('recordTimer');
const prepProgress = document.getElementById('prepProgress');
const recordProgress = document.getElementById('recordProgress');
const cameraPreview = document.getElementById('cameraPreview');
const recordedPreview = document.getElementById('recordedPreview');
const savedInfo = document.getElementById('savedInfo');

// Event Listeners
startBtn.addEventListener('click', startInterview);
startPrepBtn.addEventListener('click', startPreparation);
document.getElementById('earlySubmitBtn').addEventListener('click', earlySubmit);
submitBtn.addEventListener('click', submitAnswer);
restartBtn.addEventListener('click', resetInterview);

// Start Interview
function startInterview() {
    currentQuestion = 0;
    savedVideos = [];
    startPage.classList.remove('active');
    interviewPage.classList.add('active');
    loadQuestion();
}

// Load Question
function loadQuestion() {
    if (currentQuestion >= questions.length) {
        completeInterview();
        return;
    }

    // Update question text in both places
    const questionTextEl = document.getElementById('questionText');
    const questionTextLeftEl = document.getElementById('questionTextLeft');
    const currentQuestionText = questions[currentQuestion];
    
    questionTextEl.textContent = currentQuestionText;
    questionTextLeftEl.textContent = currentQuestionText;
    questionNumber.textContent = `Question ${currentQuestion + 1} / ${questions.length}`;

    // Reset phases
    const mainPhase = document.getElementById('mainPhase');
    prepPhase.classList.remove('active');
    mainPhase.classList.remove('active');
    recordPhase.classList.remove('active');
    submitPhase.classList.remove('active');
    submittedPhase.classList.remove('active');

    // Reset timers
    prepTimer_el.textContent = '00:15';
    recordTimer_el.textContent = '01:00';
    prepProgress.style.strokeDashoffset = '0';
    
    // First question ke liye prep phase with Start button
    if (currentQuestion === 0) {
        prepPhase.classList.add('active');
        startPrepBtn.style.display = 'block';
        startPrepBtn.disabled = false;
    } else {
        // Baaki questions ke liye automatic start - mainPhase show karo aur prep timer chalo
        prepPhase.classList.add('active');
        startPrepBtn.style.display = 'none';
        // Small delay then automatic prep timer start karo
        setTimeout(() => {
            startPreparation();
        }, 100);
    }
}

// Start Preparation Timer (15 seconds)
function startPreparation() {
    // Hide start button
    startPrepBtn.style.display = 'none';
    startPrepBtn.disabled = true;
    
    let timeLeft = 15;
    const circumference = 339.292; // 2 * PI * radius (54)

    prepTimer = setInterval(() => {
        timeLeft--;
        prepTimer_el.textContent = `00:${String(timeLeft).padStart(2, '0')}`;
        
        // Update circle progress
        const offset = circumference - (timeLeft / 15) * circumference;
        prepProgress.style.strokeDashoffset = offset;

        if (timeLeft <= 0) {
            clearInterval(prepTimer);
            startRecording();
        }
    }, 1000);
}

// Start Recording (1 minute)
async function startRecording() {
    const mainPhase = document.getElementById('mainPhase');
    prepPhase.classList.remove('active');
    mainPhase.classList.add('active');
    recordPhase.classList.add('active');

    try {
        // Request camera access
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: true, 
            audio: true 
        });

        cameraPreview.srcObject = stream;

        // Setup MediaRecorder
        recordedChunks = [];
        mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9'
        });

        mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            recordedPreview.src = url;

            // Save video info
            savedVideos.push({
                question: currentQuestion + 1,
                blob: blob,
                timestamp: new Date().toISOString()
            });

            // Stop camera stream
            stream.getTracks().forEach(track => track.stop());
            
            // Automatically submit after recording completes
            autoSubmitAnswer();
        };

        // Start recording
        mediaRecorder.start();

        // Enable submit button during recording (early submit ke liye)
        submitBtn.disabled = false;

        // Recording timer (60 seconds)
        let timeLeft = 60;
        recordTimer = setInterval(() => {
            timeLeft--;
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            recordTimer_el.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

            if (timeLeft <= 0) {
                clearInterval(recordTimer);
                stopRecording();
            }
        }, 1000);

    } catch (error) {
        console.error('Error accessing camera:', error);
        alert('Unable to access camera. Please ensure camera permissions are granted.');
        loadQuestion(); // Reset to prep phase
    }
}

// Stop Recording
function stopRecording() {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
        mediaRecorder.stop();
    }
    if (recordTimer) {
        clearInterval(recordTimer);
    }
}

// Early Submit (timer se pahle submit)
function earlySubmit() {
    // Recording rok do
    if (recordTimer) {
        clearInterval(recordTimer);
    }
    stopRecording();
}

// Submit Answer (Manual submit during recording)
function submitAnswer() {
    const mainPhase = document.getElementById('mainPhase');
    
    // Show submit phase first
    recordPhase.classList.remove('active');
    submitPhase.classList.add('active');
    
    // Download the video
    const video = savedVideos[savedVideos.length - 1];
    const url = URL.createObjectURL(video.blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `interview-question-${video.question}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show submitted confirmation
    submitPhase.classList.remove('active');
    submittedPhase.classList.add('active');

    // Move to next question after 2 seconds
    setTimeout(() => {
        currentQuestion++;
        mainPhase.classList.remove('active');
        loadQuestion();
    }, 2000);
}

// Auto Submit (Timer complete hone pe)
function autoSubmitAnswer() {
    const mainPhase = document.getElementById('mainPhase');
    
    // Download the video
    const video = savedVideos[savedVideos.length - 1];
    const url = URL.createObjectURL(video.blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `interview-question-${video.question}.webm`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    // Show submitted confirmation directly
    recordPhase.classList.remove('active');
    submittedPhase.classList.add('active');

    // Move to next question after 2 seconds
    setTimeout(() => {
        currentQuestion++;
        mainPhase.classList.remove('active');
        loadQuestion();
    }, 2000);
}

// Complete Interview
function completeInterview() {
    interviewPage.classList.remove('active');
    completionPage.classList.add('active');
    savedInfo.textContent = `${savedVideos.length} videos have been saved to your Downloads folder.`;
}

// Reset Interview
function resetInterview() {
    completionPage.classList.remove('active');
    startPage.classList.add('active');
    currentQuestion = 0;
    savedVideos = [];
    
    // Clean up any active timers
    if (prepTimer) clearInterval(prepTimer);
    if (recordTimer) clearInterval(recordTimer);
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    
    startPrepBtn.disabled = false;
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
    if (prepTimer) clearInterval(prepTimer);
    if (recordTimer) clearInterval(recordTimer);
});

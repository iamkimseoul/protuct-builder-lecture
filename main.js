// Elements
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const navLottoBtn = document.getElementById('nav-lotto-btn');
const navAnimalBtn = document.getElementById('nav-animal-btn');
const lottoSection = document.getElementById('lotto-section');
const animalSection = document.getElementById('animal-section');
const generatorBtn = document.getElementById('generator-btn');
const numbersContainer = document.getElementById('numbers-container');
const labelContainer = document.getElementById('label-container');
const imagePreview = document.getElementById('image-preview');

// Theme Management
function updateThemeButtonText(theme) {
    themeToggleBtn.innerText = theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환';
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeButtonText(newTheme);
}

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
updateThemeButtonText(savedTheme);
themeToggleBtn.addEventListener('click', toggleTheme);

// Navigation
navLottoBtn.addEventListener('click', () => {
    navLottoBtn.classList.add('active');
    navAnimalBtn.classList.remove('active');
    lottoSection.classList.add('active');
    animalSection.classList.remove('active');
    stopWebcam();
});

navAnimalBtn.addEventListener('click', () => {
    navAnimalBtn.classList.add('active');
    navLottoBtn.classList.remove('active');
    animalSection.classList.add('active');
    lottoSection.classList.remove('active');
});

// Lotto Logic
function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        numbers.add(Math.floor(Math.random() * 45) + 1);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayLottoNumbers(numbers) {
    numbersContainer.innerHTML = '';
    numbers.forEach(num => {
        const circle = document.createElement('div');
        circle.className = 'number-circle';
        circle.textContent = num;
        if (num <= 10) circle.style.backgroundColor = '#fbc400';
        else if (num <= 20) circle.style.backgroundColor = '#69c8f2';
        else if (num <= 30) circle.style.backgroundColor = '#ff7272';
        else if (num <= 40) circle.style.backgroundColor = '#aaa';
        else circle.style.backgroundColor = '#b0d840';
        numbersContainer.appendChild(circle);
    });
}

generatorBtn.addEventListener('click', () => {
    displayLottoNumbers(generateLottoNumbers());
});

// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/05WpRIQg9/";
let model, webcam, maxPredictions;
let isWebcamRunning = false;

async function loadModel() {
    if (!model) {
        model = await tmImage.load(URL + "model.json", URL + "metadata.json");
        maxPredictions = model.getTotalClasses();
    }
}

async function startCamera() {
    await loadModel();
    stopWebcam();
    imagePreview.style.display = 'none';
    
    webcam = new tmImage.Webcam(300, 300, true);
    await webcam.setup();
    await webcam.play();
    isWebcamRunning = true;
    
    const container = document.getElementById("webcam-container");
    container.innerHTML = '';
    container.appendChild(webcam.canvas);
    
    initLabels();
    window.requestAnimationFrame(webcamLoop);
}

function stopWebcam() {
    if (webcam) {
        webcam.stop();
        isWebcamRunning = false;
        document.getElementById("webcam-container").innerHTML = '';
    }
}

async function webcamLoop() {
    if (isWebcamRunning) {
        webcam.update();
        await predict(webcam.canvas);
        window.requestAnimationFrame(webcamLoop);
    }
}

function initLabels() {
    labelContainer.innerHTML = '';
    for (let i = 0; i < maxPredictions; i++) {
        const div = document.createElement("div");
        div.className = "prediction-bar-container";
        div.innerHTML = `<span class="prediction-label"></span><div class="bar-wrapper"><div class="bar"></div></div>`;
        labelContainer.appendChild(div);
    }
}

async function predict(imageElement) {
    const predictions = await model.predict(imageElement);
    for (let i = 0; i < maxPredictions; i++) {
        const className = predictions[i].className;
        const prob = (predictions[i].probability * 100).toFixed(0);
        const barDiv = labelContainer.childNodes[i];
        barDiv.querySelector('.prediction-label').innerText = `${className}: ${prob}%`;
        const bar = barDiv.querySelector('.bar');
        bar.style.width = prob + "%";
        bar.style.backgroundColor = className === "강아지" ? "#ffc107" : "#17a2b8";
    }
}

async function handleFileUpload(event) {
    stopWebcam();
    await loadModel();
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        imagePreview.src = e.target.result;
        imagePreview.style.display = 'block';
        initLabels();
        // Wait for image to load before predicting
        imagePreview.onload = async () => {
            await predict(imagePreview);
        };
    };
    reader.readAsDataURL(file);
}

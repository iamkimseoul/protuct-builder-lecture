const lightThemeBtn = document.getElementById('light-theme-btn');
const darkThemeBtn = document.getElementById('dark-theme-btn');

// Theme Management
function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
}

// Initial Theme Setup
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// Theme Event Listeners
lightThemeBtn.addEventListener('click', () => setTheme('light'));
darkThemeBtn.addEventListener('click', () => setTheme('dark'));

// Teachable Machine Logic
const URL = "https://teachablemachine.withgoogle.com/models/05WpRIQg9/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
    // Hide start button
    document.querySelector('.start-btn').style.display = 'none';

    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    const flip = true; 
    webcam = new tmImage.Webcam(300, 300, flip); 
    await webcam.setup(); 
    await webcam.play();
    window.requestAnimationFrame(loop);

    const webcamContainer = document.getElementById("webcam-container");
    webcamContainer.appendChild(webcam.canvas);
    
    labelContainer = document.getElementById("label-container");
    labelContainer.innerHTML = ''; // Clear previous
    for (let i = 0; i < maxPredictions; i++) {
        const barContainer = document.createElement("div");
        barContainer.className = "prediction-bar-container";
        
        const labelName = document.createElement("span");
        labelName.className = "prediction-label";
        
        const barWrapper = document.createElement("div");
        barWrapper.className = "bar-wrapper";
        
        const bar = document.createElement("div");
        bar.className = "bar";
        
        barWrapper.appendChild(bar);
        barContainer.appendChild(labelName);
        barContainer.appendChild(barWrapper);
        labelContainer.appendChild(barContainer);
    }
}

async function loop() {
    webcam.update(); 
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    for (let i = 0; i < maxPredictions; i++) {
        const className = prediction[i].className;
        const probability = (prediction[i].probability * 100).toFixed(0);
        
        const barContainer = labelContainer.childNodes[i];
        barContainer.querySelector('.prediction-label').innerText = `${className}: ${probability}%`;
        barContainer.querySelector('.bar').style.width = probability + "%";
        
        // Add specific colors based on class
        if (className === "강아지") {
            barContainer.querySelector('.bar').style.backgroundColor = "#ffc107";
        } else if (className === "고양이") {
            barContainer.querySelector('.bar').style.backgroundColor = "#17a2b8";
        }
    }
}

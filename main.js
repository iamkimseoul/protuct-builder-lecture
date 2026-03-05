const generatorBtn = document.getElementById('generator-btn');
const numbersContainer = document.getElementById('numbers-container');
const lightThemeBtn = document.getElementById('light-theme-btn');
const darkThemeBtn = document.getElementById('dark-theme-btn');
const systemThemeBtn = document.getElementById('system-theme-btn');

// Theme Management
function setTheme(theme) {
    if (theme === 'system') {
        localStorage.removeItem('theme');
        document.documentElement.removeAttribute('data-theme');
    } else {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }
}

// Initial Theme Setup
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// Theme Event Listeners
lightThemeBtn.addEventListener('click', () => setTheme('light'));
darkThemeBtn.addEventListener('click', () => setTheme('dark'));
systemThemeBtn.addEventListener('click', () => setTheme('system'));

// Lotto Logic
function generateLottoNumbers() {
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }
    return Array.from(numbers).sort((a, b) => a - b);
}

function displayNumbers(numbers) {
    numbersContainer.innerHTML = '';
    for (const number of numbers) {
        const circle = document.createElement('div');
        circle.classList.add('number-circle');
        circle.textContent = number;

        if (number <= 10) {
            circle.style.backgroundColor = '#fbc400';
        } else if (number <= 20) {
            circle.style.backgroundColor = '#69c8f2';
        } else if (number <= 30) {
            circle.style.backgroundColor = '#ff7272';
        } else if (number <= 40) {
            circle.style.backgroundColor = '#aaa';
        } else {
            circle.style.backgroundColor = '#b0d840';
        }

        numbersContainer.appendChild(circle);
    }
}

generatorBtn.addEventListener('click', () => {
    const generatedNumbers = generateLottoNumbers();
    displayNumbers(generatedNumbers);
});

// Initial generation
const initialNumbers = generateLottoNumbers();
displayNumbers(initialNumbers);

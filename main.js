const generatorBtn = document.getElementById('generator-btn');
const numbersContainer = document.getElementById('numbers-container');

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

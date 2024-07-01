const $time = document.querySelector('time');
const $paragraph = document.querySelector('p');
const $input = document.querySelector('input');

const INITIAL_TIME = 30;

const TEXT = 'the quick brown fox jumps over the lazy dog and this is one of the first projects that we can use to practice out Javascript knowledge for fun and make profit while we test our typing speed';

let words = []
let currentTime = INITIAL_TIME;

initGame();
initEvents();

function initGame() {
	words = TEXT.split(' ').slice(0, 32);
	currentTime = INITIAL_TIME;
	
	$time.textContent = currentTime;

	$paragraph.innerHTML = words.map((word, index) => {
		const letters = word.split('');

		return `<j-word>
			${letters
				.map(letter => `<j-letter>${letter}</j-letter>`)
				.join('')
			}
		</j-word>
		`
	}).join('');

	$firstWord = $paragraph.querySelector('j-word');
	$firstWord.classList.add('active');
	$firstWord.querySelector('j-letter').classList.add('active');

	const intervalId = setInterval(() => {
		currentTime--;
		$time.textContent = currentTime;

		if (currentTime === 0) {
			clearInterval(intervalId);
			gameOver();
		}
	}, 1000);
}

function initEvents() {
	document.addEventListener('keydown', () => {
		$input.focus();
	})
	$input.addEventListener('keydown', onKeyDown);
	$input.addEventListener('keyup', onKeyUp);
}

function onKeyDown(event) {
	const $currentWord = $paragraph.querySelector('j-word.active');
	const $currentLetter = $currentWord.querySelector('j-letter.active');

	const { key} = event;

	if (key === ' ') {
		event.preventDefault();

		const $nextWord = $currentWord.nextElementSibling;
		const $nextLetter = $nextWord.querySelector('j-letter');

		$currentWord.classList.remove('active', 'marked');
		$currentLetter.classList.remove('active');

		$nextWord.classList.add('active');
		$nextLetter.classList.add('active');

		$input.value = '';

		const hasMissedLetters = $currentWord.querySelectorAll('j-letter:not(.correct)').length > 0;

		const classToAdd = hasMissedLetters ? 'marked' : 'correct';
		$currentWord.classList.add(classToAdd);


	}
}

function onKeyUp() {
	// get the actual elements
	const $currentWord = $paragraph.querySelector('j-word.active');
	const $currentLetter = $currentWord.querySelector('j-letter.active');

	const currentWord = $currentWord.innerText.trim();
	$input.maxLength = currentWord.length;

	const $allLetters = $currentWord.querySelectorAll('j-letter');
	$allLetters.forEach($letter => $letter.classList.remove('correct', 'incorrect'));

	$input.value.split('').forEach((char, index) => {
		const $letter = $allLetters[index];
		const letterToCheck = currentWord[index];

		const isCorrect = char === letterToCheck;
		const letterClass = isCorrect ? 'correct' : 'incorrect'
		
		$letter.classList.add(letterClass);
	});

	$currentLetter.classList.remove('active', 'is-last');
	const inputLength = $input.value.length;
	const $nextActiveLetter = $allLetters[inputLength];

	if ($nextActiveLetter) {
		$nextActiveLetter.classList.add('active');
	} else {
		$currentLetter.classList.add('active', 'is-last');

		// game over if there is no next word
		// TODO: check if the last word is the last word of the text
	}

}

function gameOver() {
	console.log('Game Over');
}
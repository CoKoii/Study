'use strict';

const guessNumber = parseInt(Math.random() * 20 + 1);

const checkBtn = () => {
  const guess = document.querySelector('.guess').value;
  if (guess < guessNumber) {
    document.querySelector('.message').innerHTML = 'Too low';
    document.querySelector('.score').innerHTML--;
  } else if (guess > guessNumber) {
    document.querySelector('.message').innerHTML = 'Too high';
    document.querySelector('.score').innerHTML--;
  } else {
    document.querySelector('.message').innerHTML = 'Correct Number';
    document.querySelector('body').style.backgroundColor = '#60b347';
    document.querySelector('.number').innerHTML = guessNumber;
  }
};
document.querySelector('.check').addEventListener('click', checkBtn);

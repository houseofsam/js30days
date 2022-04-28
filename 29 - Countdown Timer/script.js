let countdown; //to stop function running at 0.
const timerDisplay = document.querySelector('.display__time-left');
const endTime = document.querySelector('.display__end-time');
const buttons = document.querySelectorAll('[data-time]');

function timer(seconds) {
  // clear any existing timers
  clearInterval(countdown);
  //number of seconds you want the function to function for
  /* setInterval(function () {
    seconds--;
  }, 1000); issues with this method. Sometimes function will stop running randomly, after long periods, when scrolling on iOS, etc.*/ 

  // const now = (new Date()).getTime();
  const now = Date.now(); //current timestamp in milliseconds
  console.log(now);
  const then = now + seconds * 1000;

  console.log({now, then});

  displayTimeLeft(seconds);

  displayEndTime(then);

  //does not run immediately, waits 1 sec. Therefore we add displayTimeLeft function above and below.
  countdown = setInterval(() => {
    const secondsLeft = Math.round((then - Date.now()) / 1000);
    // check if we should stop it!
    if(secondsLeft < 0) {
      clearInterval(countdown);
      return; //return alone won't stop interval from running. It'll just not show us anything after 0 secs. Therefore we store interval in it's own variable 'countdown' above & use clearInterval method at the end.
    }
    
    displayTimeLeft(secondsLeft);
    // console.log(secondsLeft);
  }, 1000) //every sec. = 1000ms
}

function displayTimeLeft(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainderSeconds = seconds % 60;
  const display = `${minutes}:${remainderSeconds < 10 ? '0' : ''}${remainderSeconds}`;
  timerDisplay.textContent = display;
  document.title = display;
  console.log({seconds, minutes, remainderSeconds});
}

function displayEndTime (timestamp) {
  const end = new Date(timestamp); //gets ms of point in time in the future (now + seconds = then)
  const hour = end.getHours();
  const minutes = end.getMinutes();
  // const adjustedHour = hour > 12 ? hour - 12 : hour;
  endTime.textContent = `Be Back At ${hour > 12 ? hour - 12 : hour}:${minutes < 10 ? '0' : ''}${minutes}`;
}

function startTimer() {
  const seconds = parseInt(this.dataset.time); //without parseInt, it'll give us a STRING of the number of seconds.
  // console.log(seconds);
  timer(seconds);
}

buttons.forEach(button => button.addEventListener('click', startTimer));
document.customForm.addEventListener('submit', function(e) {
  e.preventDefault(); //prevent pg from reloading
  const mins = this.minutes.value;
  console.log(mins);
  timer(mins * 60);
  this.reset(); //clear the text field
})
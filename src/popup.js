import "./timer.css"

const timerText = document.getElementById("timerText");
const timerHour = document.getElementById("timerHour");
const timerMinute = document.getElementById("timerMinute");
const timerSecond = document.getElementById("timerSecond");
const startTimerButton = document.getElementById("startTimerButton");
const increaseHourButton = document.getElementById("increaseHourButton");
const decreaseHourButton = document.getElementById("decreaseHourButton");
const increaseMinuteButton = document.getElementById("increaseMinuteButton");
const decreaseMinuteButton = document.getElementById("decreaseMinuteButton");
const increaseSecondButton = document.getElementById("increaseSecondButton");
const decreaseSecondButton = document.getElementById("decreaseSecondButton");
const resetTimerButton = document.getElementById("resetTimerButton");

var buttonClickCallback = async (type) => {
  await chrome.runtime.sendMessage({ type: type }, (res) => {
    updateTimerDisplay(res.timer);
  });
}
document.addEventListener('DOMContentLoaded', () => {
  buttonClickCallback('getTime')
  chrome.tabs.query({ active: true, currentWindow: true }, function (tab) {
    chrome.runtime.sendMessage({ type: 'getChromeTab', tabID: tab[0].id }, (res) => {
      updateTimerDisplay(res.timer);
    });
  });
});
startTimerButton.addEventListener("click", () => buttonClickCallback('start'));
increaseHourButton.addEventListener("click", () => buttonClickCallback('increaseHour'));
decreaseHourButton.addEventListener("click", () => buttonClickCallback('decreaseHour'));
increaseMinuteButton.addEventListener("click", () => buttonClickCallback('increaseMinute'));
decreaseMinuteButton.addEventListener("click", () => buttonClickCallback('decreaseMinute'));
increaseSecondButton.addEventListener("click", () => buttonClickCallback('increaseSecond'));
decreaseSecondButton.addEventListener("click", () => buttonClickCallback('decreaseSecond'));
resetTimerButton.addEventListener("click", () => buttonClickCallback('reset'));

chrome.runtime.onMessage.addListener(async (req, sender, sendResponse) => {
  let { type, timer } = req
  let { hour, minute, second } = timer;
  if (req.type !== 'update') return;
  updateTimerDisplay(timer);
});

function updateTimerDisplay(timer) {
  if (!timer) return;
  timerHour.innerText = String(timer.hour).padStart(2, '0');
  timerMinute.innerText = String(timer.minute).padStart(2, '0');
  timerSecond.innerText = String(timer.second).padStart(2, '0');
}
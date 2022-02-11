const ONE_SECOND = 1000;

class Timer {
  constructor() {
    this.interval = null;
    this.timeLeft = 0;
    this.tabID = 0;
  }

  startTimer() {
    console.log("Starting Timer");
    this.interval = setInterval(() => {
      this.tick();
    }, ONE_SECOND)
  }

  resetTimer() {
    console.log("Resetting Timer");
    clearInterval(this.interval);
    this.timeLeft = 0;
  }

  tick() {
    if (this.timeLeft <= 0) {
      this.resetTimer();
      if (this.tabID === null) return;
      chrome.scripting.executeScript({
        target: { tabId: this.tabID },
        function: setVideoState,
      });
      console.log("Timer Done");
      return;
    }

    this.timeLeft--;
    chrome.runtime.sendMessage({
      type: 'update',
      timer: {
        hour: timer.getHour,
        minute: timer.getMinute,
        second: timer.getSecond
      }
    });
  }

  setTabID(id) {
    this.tabID = id
  }

  increaseHour() {
    if (this.getHour >= 24) return;
    this.timeLeft += 60 * 60;
  }

  decreaseHour() {
    if (this.getHour <= 0) return;
    this.timeLeft -= 60 * 60;
  }

  increaseMinute() {
    if (this.getMinute >= 59) return;
    this.timeLeft += 60;
  }

  decreaseMinute() {
    if (this.getMinute <= 0) return;
    this.timeLeft -= 60;
  }

  increaseSecond() {
    if (this.getSecond >= 59) return;
    this.timeLeft++;
  }

  decreaseSecond() {
    if (this.getSecond <= 0) return;
    this.timeLeft--;
  }

  get getHour() {
    return Math.floor(this.timeLeft / (60 * 60));
  }

  get getMinute() {
    return Math.floor(this.timeLeft / 60) % 60;
  }

  get getSecond() {
    return this.timeLeft % 60;
  }
}

const timer = new Timer();

chrome.runtime.onMessage.addListener((req, sender, sendResponse) => {
  let { type = null, tabID = null } = req;

  switch (type) {
    case 'getChromeTab':
      console.log(tabID);
      timer.setTabID(tabID)
      break;
    case 'getTime':
      break;
    case 'increaseHour':
      timer.increaseHour();
      break;
    case 'increaseMinute':
      timer.increaseMinute();
      break;
    case 'increaseSecond':
      timer.increaseSecond();
      break;
    case 'decreaseHour':
      timer.decreaseHour();
      break;
    case 'decreaseMinute':
      timer.decreaseMinute();
      break;
    case 'decreaseSecond':
      timer.decreaseSecond();
      break;
    case 'start':
      timer.startTimer();
      break;
    case 'reset':
      timer.resetTimer();
      break;
    default:
      console.error("Invalid message type");
  }

  sendResponse({
    timer: {
      hour: timer.getHour,
      minute: timer.getMinute,
      second: timer.getSecond
    }
  });
});

// Pauses video, function that gets injected
function setVideoState() {
  let videos = document.getElementsByTagName('video')
  for (let video of videos) {
    video.pause();
  }
}
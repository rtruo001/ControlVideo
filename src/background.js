const ONE_SECOND = 1000;
const MANIFEST_V2 = 2;
const MANIFEST_V3 = 3;

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
    // TODO: Possible other methods in preventing long term persistence.
    // This line is to prevent background.js from persistenting after the timer ends.
    // chrome.runtime.getBackgroundPage();

    if (this.timeLeft <= 0) {
      this.resetTimer();
      this.timerPausesVideo();
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

  timerPausesVideo() {
    let { manifest_version } = chrome.runtime.getManifest()
    if (manifest_version === MANIFEST_V2) {
      let iifeCodeStr = `(${pauseVideoState.toString()})()`;
      chrome.tabs.executeScript(
        this.tabID,
        { code: iifeCodeStr },
        () => { console.log("V2 Timer Done") }
      )
    } else {
      if (this.tabID === null) return;
      chrome.scripting.executeScript({
        target: { tabId: this.tabID },
        function: pauseVideoState,
      });
      console.log("V3 Timer Done");
    }
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
function pauseVideoState() {
  let videos = document.getElementsByTagName('video')
  for (let video of videos) {
    video.pause();
  }
  console.log('Video Paused');
}
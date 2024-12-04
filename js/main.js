"use strict";
(() => {
  // src/Stopwatch.ts
  function zeroPad(num, places) {
    var zeros = places - num.toString().length + 1;
    return Array(+(zeros > 0 && zeros)).join("0") + num.toString();
  }
  function prettyTime(milliseconds) {
    let seconds = milliseconds / 1e3;
    let minutes = seconds / 60;
    let hours = Math.floor(minutes / 60);
    minutes = Math.floor(minutes % 60);
    seconds = Math.floor(seconds % 60);
    milliseconds = Math.floor(milliseconds % 1e3);
    return hours.toString() + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2) + "." + zeroPad(milliseconds, 3);
  }
  function onkeydownwrapper(callback) {
    return function(event) {
      if (event.code === "Enter" || event.code === "Space" || event.code === "NumpadEnter") {
        return callback();
      }
    };
  }
  function addOnMouseKeyDownListeners(button, callback) {
    button.addEventListener("mousedown", callback);
    button.addEventListener("keydown", onkeydownwrapper(callback));
  }
  var Stopwatch = class {
    constructor(id) {
      this.id = id;
      this.start_time = void 0;
      this.interval = void 0;
      this.time_passed = 0;
      let start_or_split_button = document.createElement("button");
      addOnMouseKeyDownListeners(start_or_split_button, this.startOrSplit.bind(this));
      start_or_split_button.textContent = "Start";
      this.start_split_button = start_or_split_button;
      let stop_button = document.createElement("button");
      stop_button.textContent = "Stop";
      stop_button.disabled = true;
      addOnMouseKeyDownListeners(stop_button, this.stop.bind(this));
      this.stop_button = stop_button;
      let reset_button = document.createElement("button");
      reset_button.textContent = "Reset";
      reset_button.disabled = true;
      addOnMouseKeyDownListeners(reset_button, this.reset.bind(this));
      this.reset_button = reset_button;
      let nodeTime = document.createElement("h2");
      nodeTime.className = "stopwatch-time";
      this.nodeTime = nodeTime;
      let node = document.createElement("div");
      node.className = "stopwatch";
      node.appendChild(this.start_split_button);
      node.appendChild(this.stop_button);
      node.appendChild(this.reset_button);
      node.appendChild(this.nodeTime);
      this.node = node;
      this.updateTime(this.time_passed);
    }
    isStarted() {
      return this.start_time !== void 0;
    }
    updateTime(time_passed) {
      this.nodeTime.textContent = prettyTime(time_passed);
    }
    update() {
      let time_passed = this.time_passed;
      let current_time = Date.now();
      if (this.isStarted() && this.start_time !== void 0) {
        time_passed += current_time - this.start_time;
      }
      this.updateTime(time_passed);
      return current_time;
    }
    startOrSplit() {
      if (this.start_time === void 0) {
        this.start_time = Date.now();
        this.interval = setInterval(() => this.update(), 13);
        this.start_split_button.textContent = "Split";
        this.stop_button.disabled = false;
        this.reset_button.disabled = true;
      } else {
        let current_time = this.update();
        let split_time = current_time - this.start_time + this.time_passed;
        let split = document.createElement("h2");
        split.setAttribute("class", "stopwatch-time");
        split.textContent = prettyTime(split_time);
        this.node.insertBefore(split, this.nodeTime.nextElementSibling);
      }
    }
    stop() {
      let current_time = this.update();
      clearInterval(this.interval);
      if (this.start_time !== void 0) {
        this.time_passed += current_time - this.start_time;
      }
      this.interval = void 0;
      this.start_time = void 0;
      this.update();
      this.stop_button.disabled = true;
      this.start_split_button.textContent = "Start";
      this.reset_button.disabled = false;
    }
    reset() {
      this.time_passed = 0;
      this.update();
      Array.from(this.node.querySelectorAll(".stopwatch-time")).slice(1).forEach((child) => this.node.removeChild(child));
      this.reset_button.disabled = true;
    }
  };

  // src/State.ts
  var State = class {
    constructor(stopwatch_container) {
      this.stopwatches = [];
      this.stopwatch_container = stopwatch_container;
    }
    addStopwatch() {
      const id = this.stopwatches.length;
      const stopwatch = new Stopwatch(id);
      this.stopwatches.push(stopwatch);
      this.stopwatch_container.appendChild(stopwatch.node);
    }
  };

  // src/AddStopwatchButton.ts
  var AddStopwatchButton = class {
    constructor(state) {
      const node = document.createElement("button");
      node.className = "add-stopwatch";
      node.textContent = "Add stopwatch";
      node.addEventListener("click", state.addStopwatch.bind(state));
      this.node = node;
    }
  };

  // src/main.ts
  function addServiceWorkerIfSupported() {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/stopwatch/service_worker.js").then((registration) => {
        registration.update();
      });
    }
  }
  function addStopwatchUI() {
    const stopwatch_container = document.getElementById("stopwatch-container");
    if (stopwatch_container === null) {
      throw new Error("stopwatch-container was not found or not a div");
    }
    const state = new State(stopwatch_container);
    state.addStopwatch();
    const addStopwatchButton = new AddStopwatchButton(state);
    const addStopwatchContainer = document.getElementById("add-stopwatch-container");
    addStopwatchContainer?.appendChild(addStopwatchButton.node);
  }
  function initialize() {
    addStopwatchUI();
    addServiceWorkerIfSupported();
  }
  window.addEventListener("load", initialize);
})();

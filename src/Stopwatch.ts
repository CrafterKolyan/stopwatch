function zeroPad(num: number, places: number) {
  var zeros = places - num.toString().length + 1
  return Array(+(zeros > 0 && zeros)).join("0") + num.toString()
}

function prettyTime(milliseconds: number) {
  let seconds = milliseconds / 1000
  let minutes = seconds / 60
  let hours = Math.floor(minutes / 60)
  minutes = Math.floor(minutes % 60)
  seconds = Math.floor(seconds % 60)
  milliseconds = Math.floor(milliseconds % 1000)
  return hours.toString() + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2) + "." + zeroPad(milliseconds, 3)
}

function onkeydownwrapper(callback: () => void) {
  return function (event: KeyboardEvent) {
    if (event.code === "Enter" || event.code === "Space" || event.code === "NumpadEnter") {
      return callback()
    }
  }
}

function addOnMouseKeyDownListeners(button: HTMLButtonElement, callback: () => void) {
  button.addEventListener("mousedown", callback)
  button.addEventListener("keydown", onkeydownwrapper(callback))
}

export class Stopwatch {
  id: number
  start_time?: number | undefined
  interval?: number | undefined
  time_passed: number
  node: HTMLDivElement
  nodeTime: HTMLElement
  start_split_button: HTMLButtonElement
  stop_button: HTMLButtonElement
  reset_button: HTMLButtonElement

  constructor(id: number) {
    this.id = id
    this.start_time = undefined
    this.interval = undefined
    this.time_passed = 0

    let start_or_split_button = document.createElement("button")
    addOnMouseKeyDownListeners(start_or_split_button, this.startOrSplit.bind(this))
    start_or_split_button.textContent = "Start"
    this.start_split_button = start_or_split_button

    let stop_button = document.createElement("button")
    stop_button.textContent = "Stop"
    stop_button.disabled = true
    addOnMouseKeyDownListeners(stop_button, this.stop.bind(this))
    this.stop_button = stop_button

    let reset_button = document.createElement("button")
    reset_button.textContent = "Reset"
    reset_button.disabled = true
    addOnMouseKeyDownListeners(reset_button, this.reset.bind(this))
    this.reset_button = reset_button

    let nodeTime = document.createElement("h2")
    nodeTime.className = "stopwatch-time"
    this.nodeTime = nodeTime

    let node = document.createElement("div")
    node.className = "stopwatch"
    node.appendChild(this.start_split_button)
    node.appendChild(this.stop_button)
    node.appendChild(this.reset_button)
    node.appendChild(this.nodeTime)

    this.node = node

    this.updateTime(this.time_passed)
  }

  isStarted() {
    return this.start_time !== undefined
  }

  updateTime(time_passed: number) {
    this.nodeTime.textContent = prettyTime(time_passed)
  }

  update() {
    let time_passed = this.time_passed
    let current_time = Date.now()
    if (this.isStarted() && this.start_time !== undefined) {
      time_passed += current_time - this.start_time
    }
    this.updateTime(time_passed)
    return current_time
  }

  startOrSplit() {
    if (this.start_time === undefined) {
      this.start_time = Date.now()
      this.interval = setInterval(() => this.update(), 13)
      this.start_split_button.textContent = "Split"
      this.stop_button.disabled = false
      this.reset_button.disabled = true
    } else {
      let current_time = this.update()
      let split_time = current_time - this.start_time + this.time_passed
      let split = document.createElement("h2")
      split.setAttribute("class", "stopwatch-time")
      split.textContent = prettyTime(split_time)

      // Insert just after current time
      this.node.insertBefore(split, this.nodeTime.nextElementSibling)
    }
  }

  stop() {
    let current_time = this.update()
    clearInterval(this.interval)

    if (this.start_time !== undefined) {
      this.time_passed += current_time - this.start_time
    }
    this.interval = undefined
    this.start_time = undefined
    this.update()

    this.stop_button.disabled = true
    this.start_split_button.textContent = "Start"
    this.reset_button.disabled = false
  }

  reset() {
    this.time_passed = 0
    this.update()

    Array.from(this.node.querySelectorAll(".stopwatch-time"))
      .slice(1)
      .forEach((child) => this.node.removeChild(child))
    this.reset_button.disabled = true
  }
}

function zeroPad(num, places) {
  var zeros = places - num.toString().length + 1
  return Array(+(zeros > 0 && zeros)).join("0") + num.toString()
}

function prettyTime(milliseconds) {
  let seconds = milliseconds / 1000
  let minutes = seconds / 60
  let hours = Math.floor(minutes / 60)
  minutes = Math.floor(minutes % 60)
  seconds = Math.floor(seconds % 60)
  milliseconds = Math.floor(milliseconds % 1000)
  return hours.toString() + ":" + zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2) + "." + zeroPad(milliseconds, 3)
}

function updateTime(stopwatch, time_passed) {
  document.getElementById("stopwatch-time" + stopwatch.id).textContent = prettyTime(time_passed)
}

function updateStopwatch(stopwatch) {
  let time_passed = stopwatch.time_passed
  let current_time = Date.now()
  if (typeof stopwatch.start_time !== "undefined") {
    time_passed += current_time - stopwatch.start_time
  }
  updateTime(stopwatch, time_passed)
  return current_time
}

function startStopwatch(element) {
  let id = element.getAttribute("data-id")
  let stopwatch = window.stopwatches.find((stopwatch) => stopwatch.id == id)
  stopwatch.start_time = Date.now()
  stopwatch.interval = setInterval(() => updateStopwatch(stopwatch), 13)
  document.getElementById("start" + id).disabled = true
  document.getElementById("stop" + id).disabled = false
  document.getElementById("reset" + id).disabled = true
}

function stopStopwatch(element) {
  let id = element.getAttribute("data-id")
  let stopwatch = window.stopwatches.find((stopwatch) => stopwatch.id == id)
  let current_time = updateStopwatch(stopwatch)
  clearInterval(stopwatch.interval)

  if (typeof stopwatch.start_time !== "undefined") {
    stopwatch.time_passed += current_time - stopwatch.start_time
  }
  stopwatch.start_time = undefined
  stopwatch.interval = undefined
  updateStopwatch(stopwatch)

  document.getElementById("stop" + id).disabled = true
  document.getElementById("start" + id).disabled = false
  document.getElementById("reset" + id).disabled = false
}

function resetStopwatch(element) {
  let id = element.getAttribute("data-id")
  let stopwatch = window.stopwatches.find((stopwatch) => stopwatch.id == id)

  stopwatch.time_passed = 0
  updateStopwatch(stopwatch)

  document.getElementById("reset" + id).disabled = true
  document.getElementById("start" + id).innerText = "Start"
}

function addStopwatch() {
  let id = window.stopwatches.length
  let stopwatch = document.createElement("div")
  let stopwatch_container = document.getElementById("stopwatch-container")
  stopwatch_container.appendChild(stopwatch)

  function onListeners(f) {
    let function_name = f.name
    let listeners = ["onmousedown", "ontouchstart", "onclick", "ontouch"]
      .map((event) => event + '="' + function_name + '(this)"')
      .join(" ")
    return listeners
  }

  // prettier-ignore
  stopwatch.outerHTML = '<div class="stopwatch"> \
            <h2 id="stopwatch-time' + id + '" class="stopwatch-time">0:00:00.000</h2> \
            <button id="start' + id + '" ' + onListeners(startStopwatch) + ' data-id="' + id + '">Start</button> \
            <button id="stop' + id + '" ' + onListeners(stopStopwatch) + ' data-id="' + id + '" disabled>Stop</button> \
            <button id="reset' + id + '" ' + onListeners(resetStopwatch) + ' data-id="' + id + '" disabled>Reset</button> \
          </div>'

  window.stopwatches.push({
    id: id,
    start_time: undefined,
    interval: undefined,
    time_passed: 0,
    node: stopwatch_container.childNodes[stopwatch_container.childNodes.length - 2]
  })
}

function initialize() {
  window.stopwatches = []
  window.add_stopwatch_node = document.getElementById("add-stopwatch")
  addStopwatch()
  updateTime(stopwatches[0], 0)
}

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
  stopwatch.nodeTime.textContent = prettyTime(time_passed)
}

function updateStopwatch(stopwatch) {
  let time_passed = stopwatch.time_passed
  let current_time = Date.now()
  if (stopwatch.isStarted) {
    time_passed += current_time - stopwatch.start_time
  }
  updateTime(stopwatch, time_passed)
  return current_time
}

function startOrSplitStopwatch(element) {
  let id = element.getAttribute("data-id")
  let stopwatch = window.stopwatches.find((stopwatch) => stopwatch.id == id)
  if (!stopwatch.isStarted) {
    stopwatch.isStarted = true
    stopwatch.start_time = Date.now()
    stopwatch.interval = setInterval(() => updateStopwatch(stopwatch), 13)
    document.getElementById("start-split" + id).textContent = "Split"
    document.getElementById("stop" + id).disabled = false
    document.getElementById("reset" + id).disabled = true
  } else {
    let current_time = updateStopwatch(stopwatch)
    let split_time = current_time - stopwatch.start_time + stopwatch.time_passed
    let split = document.createElement("h2")
    split.setAttribute("class", "stopwatch-time")
    split.textContent = prettyTime(split_time)
    stopwatch.node.insertBefore(split, stopwatch.nodeTime)
  }
}

function stopStopwatch(element) {
  let id = element.getAttribute("data-id")
  let stopwatch = window.stopwatches.find((stopwatch) => stopwatch.id == id)
  let current_time = updateStopwatch(stopwatch)
  clearInterval(stopwatch.interval)

  if (stopwatch.isStarted) {
    stopwatch.time_passed += current_time - stopwatch.start_time
  }
  stopwatch.interval = undefined
  stopwatch.start_time = undefined
  stopwatch.isStarted = false
  updateStopwatch(stopwatch)

  document.getElementById("stop" + id).disabled = true
  document.getElementById("start-split" + id).textContent = "Start"
  document.getElementById("reset" + id).disabled = false
}

function resetStopwatch(element) {
  let id = element.getAttribute("data-id")
  let stopwatch = window.stopwatches.find((stopwatch) => stopwatch.id == id)

  stopwatch.time_passed = 0
  updateStopwatch(stopwatch)

  Array.from(stopwatch.node.querySelectorAll(".stopwatch-time"))
    .slice(0, -1)
    .forEach((child) => stopwatch.node.removeChild(child))
  document.getElementById("reset" + id).disabled = true
}

function onkeydownwrapper(f) {
  return function (event, element) {
    if (event.key === "Enter" || event.key === " ") {
      return f(event, element)
    }
  }
}

function addStopwatch() {
  let id = window.stopwatches.length
  let stopwatch = document.createElement("div")
  let stopwatch_container = document.getElementById("stopwatch-container")
  stopwatch_container.appendChild(stopwatch)

  function onListeners(f) {
    let function_name = f.name
    let listeners = ["onmousedown", "ontouchstart", "onkeydown"]
      .map((event) => {
        let function_call = function_name + "(this)"
        if (event === "onkeydown") {
          function_string = "onkeydownwrapper(" + function_string + ")(event, this)"
        }
        return event + '="' + function_call
      })
      .join(" ")
    return listeners
  }

  stopwatch.outerHTML = '\
  <div class="stopwatch"> \
    <h2 id="stopwatch-time$1" class="stopwatch-time">0:00:00.000</h2> \
    <button id="start-split$1" $2 data-id="$1" class="start">Start</button> \
    <button id="stop$1" $3 data-id="$1" disabled>Stop</button> \
    <button id="reset$1" $4 data-id="$1" disabled>Reset</button> \
  </div>'
    .replaceAll("$1", id.toString())
    .replaceAll("$2", onListeners(startOrSplitStopwatch))
    .replaceAll("$3", onListeners(stopStopwatch))
    .replaceAll("$4", onListeners(resetStopwatch))

  let node = stopwatch_container.childNodes[stopwatch_container.childNodes.length - 1]
  let nodeTime = node.firstElementChild

  window.stopwatches.push({
    id: id,
    isStarted: false,
    start_time: undefined,
    interval: undefined,
    time_passed: 0,
    node: node,
    nodeTime: nodeTime
  })
}

function initialize() {
  window.stopwatches = []
  window.add_stopwatch_node = document.getElementById("add-stopwatch")
  addStopwatch()
  updateTime(stopwatches[0], 0)
}

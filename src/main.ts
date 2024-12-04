import { State } from "./State"
import { AddStopwatchButton } from "./AddStopwatchButton"

function addServiceWorkerIfSupported() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.register("/stopwatch/service_worker.js").then((registration) => {
      registration.update()
    })
  }
}

function addStopwatchUI() {
  const stopwatch_container = document.getElementById("stopwatch-container")
  if (stopwatch_container === null) {
    throw new Error("stopwatch-container was not found or not a div")
  }
  const state = new State(stopwatch_container)
  state.addStopwatch()

  const addStopwatchButton = new AddStopwatchButton(state)
  const addStopwatchContainer = document.getElementById("add-stopwatch-container")
  addStopwatchContainer?.appendChild(addStopwatchButton.node)
}

function initialize() {
  addStopwatchUI()
  addServiceWorkerIfSupported()
}

window.addEventListener("load", initialize)

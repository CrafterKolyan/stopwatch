import { State } from "./State"
import { AddStopwatchButton } from "./AddStopwatchButton"

function initialize() {
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

window.addEventListener("load", initialize)

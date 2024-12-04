import { State } from "./State"

export class AddStopwatchButton {
  node: HTMLButtonElement
  constructor(state: State) {
    const node = document.createElement("button")
    node.className = "add-stopwatch"
    node.textContent = "Add stopwatch"
    node.addEventListener("click", state.addStopwatch.bind(state))
    this.node = node
  }
}

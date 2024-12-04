import { Stopwatch } from "./Stopwatch"

export class State {
  stopwatches: Stopwatch[]
  stopwatch_container: HTMLElement

  constructor(stopwatch_container: HTMLElement) {
    this.stopwatches = []
    this.stopwatch_container = stopwatch_container
  }

  addStopwatch() {
    const id = this.stopwatches.length
    const stopwatch = new Stopwatch(id)
    this.stopwatches.push(stopwatch)
    this.stopwatch_container.appendChild(stopwatch.node)
  }
}

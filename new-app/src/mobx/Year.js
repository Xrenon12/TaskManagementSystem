import { makeAutoObservable } from "mobx"

class Year {
    year = new Date().getUTCFullYear()
    curYear = new Date().getUTCFullYear()
    constructor() {
        makeAutoObservable(this)
    }

    next_year() {
        this.year = this.year + 1
    }
    prev_year() {
        this.year = this.year - 1;
    }
}

export default new Year()
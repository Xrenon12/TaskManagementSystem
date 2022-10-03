import { makeAutoObservable } from "mobx"

class currentDate {
    date = new Date().getDate()
    constructor() {
        makeAutoObservable(this)
    }

    next_date() {
        this.date = this.date + 1
    }
    prev_date() {
        this.date = this.date - 1;
    }
}

export default new currentDate()
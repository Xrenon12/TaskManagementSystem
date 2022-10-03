import { makeAutoObservable } from "mobx"
import Year from "./Year"

class Month {
    month = new Date().getMonth()
    curMonth = new Date().getMonth() + 1
    constructor() {
        makeAutoObservable(this)
    }

    next_month() {
        if (this.month === 11) {
            Year.next_year()
            this.month = 0
        } else {
            this.month = this.month + 1
        }
    }
    prev_month() {
        if (this.month === 0) {
            Year.prev_year()
            this.month = 11
        } else {
            this.month = this.month - 1;
        } 
    }
}

export default new Month()
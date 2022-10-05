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

    convertToDateTimeFormat(date) {
        date = date.replace('-', '.').replace('-', '.')

        let FormatDate = ''
        if (date.indexOf('T') === -1) {
            FormatDate = date.split(' ')[0].split('.')[2] + '-' + date.split(' ')[0].split('.')[1] + '-' + date.split(' ')[0].split('.')[0] + 'T' + date.split(' ')[1].split(':')[0] + ':' + date.split(' ')[1].split(':')[1]
        } else {
            FormatDate = date.split('T')[0].split('.')[0] + '-' + date.split('T')[0].split('.')[1] + '-' + date.split('T')[0].split('.')[2] + 'T' + date.split('T')[1].split(':')[0] + ':' + date.split('T')[1].split(':')[1]
        }
       return FormatDate
    }

    getDate(date) {
        let temp = new Date(date).getDate()
        if (temp < 10) {temp = ('0' + temp)}
        return temp.toString()
    }
    getMonth(date) {
        let temp = new Date(date).getMonth()
        if (temp < 10) {temp = ('0' + temp)}
        return temp.toString()
    }
    getYear(date) {
        let temp = new Date(date).getFullYear()
        if (temp < 10) {temp = ('0' + temp)}
        return temp.toString()
    }

}

export default new currentDate()
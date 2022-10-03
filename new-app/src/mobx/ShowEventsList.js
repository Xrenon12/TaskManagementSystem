import { makeAutoObservable } from "mobx"
import UserInfo from "./UserInfo"

class ShowEventsList {

    // Показатели, какая фильтрация работает слева под календарём
    ThisDay = true
    ThisWeek = false
    ThisMonth = false
    // Список всех событий у пользователя
    EventsList = []

    EventFilter = []
    EventListCurrentMonth = []
    
    constructor() {
        makeAutoObservable(this)
    }

    // Переключатель фильтрации под компактным календарём
    HistoryEventChoise(event) {
        switch (event.target.value) {
            case 'Текущий день':
                this.ThisDay = true;
                this.ThisWeek = false;
                this.ThisMonth = false;
                break;
            case 'Текущая неделя':
                this.ThisDay = false;
                this.ThisWeek = true;
                this.ThisMonth = false;
                break;
            case 'Текущий месяц':
                this.ThisDay = false;
                this.ThisWeek = false;
                this.ThisMonth = true;
                break;
            default:
                this.ThisDay = true;
                this.ThisWeek = false;
                this.ThisMonth = false;
        }
    }

    // Получить список отфильтрованных событий (История)
    ChangeEventFilter(temp) {
        this.EventFilter = temp
    }
    SetEventsList(temp) {
        this.EventsList = temp
    }

    // Получение списка событий пользователя. ID пользователя берётся из  UserInfo.UserInfo
    async fetchNewEvents() {
        const res1 = await fetch("/events" + "/" + UserInfo.UserInfo['user_id'] + '&' + UserInfo.UserInfo['schedule_id'], {

        });
        const events = res1.json();

        const events_promise = await events.then(value => {
            return value
        })

        let event_array_list = await events_promise
        this.EventsList = event_array_list
    }
    getEventListCurrentMonth(month) {
        this.EventListCurrentMonth = []
        for (let items = 0; items < this.EventsList.length; items++) {
            if (this.EventsList[items]['event_date'].split('T')[0].split('-')[1] === month.toString() || this.EventsList[items]['event_date_to'].split('T')[0].split('-')[1] === month.toString()) {
                this.EventListCurrentMonth.push(this.EventsList[items])
            }
        }
        return this.EventListCurrentMonth
    }
}

export default new ShowEventsList()
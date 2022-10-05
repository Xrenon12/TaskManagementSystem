import { makeAutoObservable } from "mobx"
import ShowEventsList from "./ShowEventsList"
import randomColor from "randomcolor";
import UserInfo from "./UserInfo";
import Year from "./Year";

class EventsBlock {

    // Тригер отрисовки
    updateScreen = true

    // Переключатели отображения менюшек
    ChangeEvent = true;
    CreateEvent = true;
    ErrorEvent = true;
    PassedEvent = true;
    SearchEvent = true;
    PassedChangeEvent = true
    DeleteEvent = true
    HistoryEvent = true

    // ID текущего выбранного события (Открытого в меню редактирования)
    actualEventId = ''
    // Информация о новом событии (Меню создания события)
    NewEvent = {
        EventInputTitle: null,
        EventTextArea: '',
        EventDateInput: '',
        EventDateToInput: '',
        UserId: '',
        ColorMark: randomColor({luminosity: 'light'}),
        EventNotificationTime: null,
        EventNotificationActive: false
    };
    actualInfoAboutEvent = []

    ListCreatedEvents = [];
    
    constructor() {
        makeAutoObservable(this)
    };

    SetChangeEvent() {
        
        // Пришлось скрыть If из-за каких-то проблем с загрузкой данных.
        // Попробовать вернуть позже т.к это ускорит отрисовку данных на форме.
        
        // if (this.actualInfoAboutEvent.length !== 0) {
            this.ChangeEvent = !this.ChangeEvent
        // }
    }
    // Переключатель отображения менюшки создания события
    SetCreateEvent() {
        this.CreateEvent = !this.CreateEvent
    }
    // Получение списка событий по ID пользователя
    async FetchListCreatedEvents(hg) {
        const res1 = await fetch("/events" + "/" + hg[0].user_id + '&' + UserInfo.UserInfo['schedule_id']);
        const events = res1.json();

        const events_promise = await events.then(value => {
            return value
        })

        let event_array_list = await events_promise

        ShowEventsList.SetEventsList(event_array_list)
    }
    // Обновление информации о событии в переменной this.NewEvent
    EventCreateChangeData(event) {
        let temp = this.NewEvent;

        switch(event.target.className) {
            case 'ColorMark':
                temp.ColorMark = event.target.value
                break
            case 'EventInputTitle':
                temp.EventInputTitle = event.target.value
                break
            case 'EventTextArea':
                temp.EventTextArea = event.target.value
                break
            case 'EventDateInput':
                temp.EventDateInput = event.target.value
                break
            case 'EventDateToInput':
                temp.EventDateToInput = event.target.value
                break
            case 'EventUsersListInput':
                temp.EventUsersListInput = event.target.value
                break
            case 'EventActiveNotificationStatus':
                temp.EventNotificationActive = event.target.checked
                break
            case 'EventNotificationTime':
                temp.EventNotificationTime = event.target.value
                break
            default:
                console.log('Somthing failed')
        }
        temp.UserId = UserInfo.UserInfo['user_id']

        this.NewEvent = temp
    }

    openCreateEvent(Year='', month='', day='') {
        let date = ''
        month.type !== 'click' ? month = month + 1 : month = month
        if (month < 10) {
            month = '0' + month 
        }
        if (day < 10) {
            day = '0' + day
        }
        if (Year !== '' && month !== '01' && day !== 0) {
            date = Year + '-' + month + '-' + day + ' ' + '00:' + '00:' + '00' 
        }
        this.NewEvent = {
            ColorMark: randomColor({luminosity: 'light'}),
            EventInputTitle: null,
            EventTextArea: '',
            EventDateInput: date,
            EventDateToInput: date,
            EventUsersListInput: '',
            EventNotificationTime: null,
            EventNotificationActive: false
        }

        this.CreateEvent = !this.CreateEvent
    }
    // Запрос на создание нового события.
    createNewEvent() {
        this.NewEvent['calendar_id'] = UserInfo.UserInfo['schedule_id']
        fetch('/create-event', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
            body: JSON.stringify(this.NewEvent)
          }).then((response) => {
            if (response.status === 400) {
                this.ErrorEvent = !this.ErrorEvent
            } else if (response.status === 200) {
                this.SetPassedEvent()
            }
            return response.json()
          });
        this.NewEvent = {
            ColorMark: randomColor({luminosity: 'light'}),
            EventInputTitle: '',
            EventTextArea: '',
            EventDateInput: '',
            EventDateToInput: '',
            EventUsersListInput: '',
            EventNotificationTime: null,
            EventNotificationActive: false
        }

        this.SetCreateEvent()
        this.fetchData()
        this.SetUpdateScreen()
    }
    // Получение информации о текущем пользователе и его событиях
    async fetchData() {
        if (UserInfo.UserInfo.length === 0) {

            let res2 = ''
            // Проверка, если в UserInfo нет информации о пользователе, используется uuid из локального хранилища
            if (UserInfo.user_uuid === '') {
                res2 = await fetch("/profile/" + localStorage.LastUserId);
            } else {
                res2 = await fetch("/profile/" + UserInfo.user_uuid);
            }
            // Запись в localStorage прав пользователя
            UserInfo.getUserPermissionsByRoleId()
            
            const userData = res2.json();
            

            const rwrw = await userData.then(value => {
                return value
            })

            let hg = await rwrw

            UserInfo.SetUserinfo(hg[0])
            this.FetchListCreatedEvents(hg)

            // const res1 = await fetch("/events/" + UserInfo.UserInfo['user_id'] + '&' + UserInfo.UserInfo['schedule_id']);
            // const events = res1.json();

            // const events_promise = await events.then(value => {
            //     return value
            // })

            // let event_array_list = await events_promise
            // ShowEventsList.SetEventsList(event_array_list)
        } else {
            const res1 = await fetch("/events/" + UserInfo.UserInfo['user_id'] + '&' + UserInfo.UserInfo['schedule_id']);
            const events = res1.json();

            const events_promise = await events.then(value => {
                return value
            })

            let event_array_list = await events_promise
            ShowEventsList.SetEventsList(event_array_list)
        }  
    }
    // Переключатели отображения менюшек
    SetErrorEvent() {
        this.ErrorEvent = !this.ErrorEvent
    }
    SetPassedEvent() {
        this.PassedEvent = !this.PassedEvent
    }
    SetSearchEvent() {
        this.SearchEvent = !this.SearchEvent
    }
    // Обновить информацию по текущему выбранному событию
    SetActualInfoAboutEvent(temp) {
        this.actualInfoAboutEvent = temp
    }
    // Поиск события по введённому ID. Поиск ведётся по ShowEventsList.EventsList
    SearchEventById(temp) {
        this.actualEventId = temp
        for (let items = 0; items < ShowEventsList.EventsList.length; items++) {
            if (ShowEventsList.EventsList[items]['event_id'] === parseInt(this.actualEventId)) {
                temp = ShowEventsList.EventsList[items]
                temp['event_date'] = temp['event_date'].split('T')[0] + ' ' + temp['event_date'].split('T')[1].split('.')[0]
                temp['event_notification_time'] = temp['event_notification_time'].split('T')[0] + ' ' + temp['event_notification_time'].split('T')[1].split('.')[0]
                this.SetActualInfoAboutEvent([temp])
            }
        }
    }
    // Сброс введённого значения в input (Ввод ID события (Поиск))
    SetDefaultEventId() {
        this.actualEventId = ''
    }
    SetUpdateScreen() {
        this.updateScreen = !this.updateScreen
    }
    SetDeleteEvent() {
        this.DeleteEvent = !this.DeleteEvent
    }
    SetPassedChangeEvent() {
        this.PassedChangeEvent = !this.PassedChangeEvent
    }
    SetHistoryEvent() {
        this.HistoryEvent = !this.HistoryEvent
    }
    deleteEvent() {
        const $this = this
        fetch('/delete-event/' + this.actualInfoAboutEvent[0].event_id, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
          }).then(function(response) {
            if (response.status === 400) {
                // Не вызываются функции от сюда
                $this.SetErrorEvent()
            } else if (response.status === 200) {
                // Не вызываются функции от сюда
                $this.SetPassedChangeEvent()
            }
            return response.json()
          });
          this.SetChangeEvent()
          this.SetDeleteEvent()

        this.fetchData()
        this.SetUpdateScreen()
    }
    getInfoAboutEvent(event) {
        
        const info_about_event = fetch('/event/' + event.target.attributes[0].nodeValue, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
          }).then(function(response) {
            return response.json()
        });

        info_about_event.then(value => {
            value[0].created_date = new Date(value[0].created_date).toLocaleString().replace(',', '')
            value[0].event_date = new Date(value[0].event_date).toLocaleString().replace(',', '')
            value[0].event_date_to = new Date(value[0].event_date_to).toLocaleString().replace(',', '')
            value[0].event_notification_time = new Date(value[0].event_notification_time).toLocaleString().replace(',', '')

            this.SetActualInfoAboutEvent(value)
        })
    }
    // Получить список всех дат на которых должно находиться событие
    getAllEventsDates(event_id, result_param=0, event_date_from='', event_date_to='') {

        // Параметр 0 - формат: ДД-ММ-ГГ, ЧЧ:ММ:СС
        // Параметр 1 - формат: ДД-ММ-ГГ
        // Параметр 2 - формат: new Date()
        
        if (event_date_from === '' && event_date_to === '') {
            for (let items = 0; items < ShowEventsList.EventsList.length; items++) {
                if (ShowEventsList.EventsList[items].event_id === event_id) {
                    event_date_from = ShowEventsList.EventsList[items].event_date
                    event_date_to = ShowEventsList.EventsList[items].event_date_to
                }
            }
        }

        let daysList = this.getDaysArray(event_date_from, event_date_to, result_param).reduce((a, v) => ({ ...a, [v]: v}), {})
        return daysList 
    }
    // Получить список всех дат на которых должно находиться событие (доп. функционал)
    getDaysArray = function(start, end, result_param) {
        for(var arr=[],dt=new Date(start); dt<=new Date(end); dt.setDate(dt.getDate()+1)){
            let day = ''
            let month = ''
            let hour = ''
            let minute = ''
            let second = ''
            if (dt.getDate() < 10) {
                day = '0' + dt.getDate()
            } else {day = dt.getDate()}
            if ((dt.getMonth()+1) < 10) {
                month = '0' + (dt.getMonth()+1)
            } else {month = dt.getMonth()+1}
            if (dt.getHours() < 10) {
                hour = '0' + dt.getHours()
            } else {hour = dt.getHours()}
            if (dt.getUTCMinutes() < 10) {
                minute = '0' + dt.getUTCMinutes()
            } else {minute = dt.getUTCMinutes()}
            if (dt.getUTCSeconds() < 10) {
                second = '0' + dt.getUTCSeconds()
            } else {second = dt.getUTCSeconds()}
            if (result_param === 0) {
                arr.push((day + '.' + month + '.' + Year.year + ', ' + hour + ':' + minute + ':' + second))
            }
            if (result_param === 1) {
                arr.push((day + '.' + month + '.' + Year.year))
            }
            if (result_param === 2) {
                arr.push(dt)
            }
        }
        return arr;
    };
}

export default new EventsBlock();
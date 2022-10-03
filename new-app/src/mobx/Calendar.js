import { makeAutoObservable } from "mobx"
import Year from "./Year"
import Month from "./Month"
import Datee from "./Date"
import EventsBlock from "./Events"
import Events from "./Events"

class Calendar {

    // Переключатель менюшек
    NewCalendar = true
    DeleteCalendar = true
    
    // Переменные для построение матрицы и календаря
    nMatrixDaysWithoutEvents = []
    nMatrixDays = []
    MatrixCalendar = []

    NewCalendarInfo = {}
    DeleteCalendarInfo = {}

    // Данные для построение матрицы и календаря
    Month = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"]
    weekDays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"]
    nDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    // Выбор календаря из фильтра справа
    currentCalendar = ''
    CalendarList = []
    
    constructor() {
        makeAutoObservable(this)
    }
    // Построить матрицу отрисовки дней и названий месяца
    generateMatrix(Counter='') {
        
        var LocalMatrix = [];

        LocalMatrix[0] = this.weekDays

        var year = Year.year;
        var month = Month.month;
        if (Counter !== '') {
            month += Counter
            if (month === 13) {
                year += 1
                month = 1
            } else if (month === 0) {
                year -= 1
                month = 12
            }
        }

        var firstDay = new Date(year, month, 1).getDay();
        if (firstDay === 0) {
            firstDay = 7
        }

        var maxDays = this.nDays[month];
        
        if (month === 1) {
            if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
                maxDays += 1;
            }
        }

        var counter = 1;
        for (var row = 1; row < 7; row++) {
            LocalMatrix[row] = [];
            for (var col = 0; col < 7; col++) {
                LocalMatrix[row][col] = '';
                if (row === 1 && col >= firstDay-1) {
                    LocalMatrix[row][col] = counter++;
                } else if (row > 1 && counter <= maxDays) {
                    LocalMatrix[row][col] = counter++;
                }
            }
        }
        if (Counter === '') {
            this.MatrixCalendar = LocalMatrix
        } else {
            return LocalMatrix
        }
        
    };
    // Построить календарь без событий
    generateCalendarWithoutEvents() {
        let temp = []
        for (let items = 0; items < 7; items++) {
            try {
                this.MatrixCalendar[items].map((nDay, index) => {
                    if (items === 0) {
                        temp.push(
                            <div className="calendar__day" id={nDay} key={temp.length}>{nDay}</div>
                        ); 
                    } else {
                        if (nDay === Datee.date && Year.year === new Date().getUTCFullYear() && Month.month === new Date().getUTCMonth()) {
                            temp.push(
                                <div className="calendar__number calendar__number-current" key={temp.length}>
                                    <div className="calendarNumber" calyear={Year.year} calmonth={Month.month} calday={nDay}>{nDay}</div>
                                </div>
                            );
                        } else {
                            if (nDay === '' && items === 5 || nDay === '' && items === 6) {

                            } else {
                                temp.push(
                                    <div className="calendar__number" key={temp.length}>
                                        <div className="calendarNumber" calyear={Year.year} calmonth={Month.month} calday={nDay}>{nDay}</div>
                                    </div>
                                );
                            }
                        }   
                    }
                }) 
            } catch (e) {
                
            }
        }
        this.nMatrixDaysWithoutEvents = temp
    }
    // Создать ДатуВремя для отображения пользователю
    returnDatetime_locale(Year, Month, Day, Hour, Minute, Second) {

        const date = new Date();
        var year = Year;
        var month = Month;
        var day = Day;
        
        if (month < 10) {
            month = '0' + month
        }
        if (day < 10) {
            day = '0' + day
        }
        if (Hour <= 9) {
            Hour = '0' + Hour
        }
        if (Minute <= 9) {
            Minute = '0' + Minute
        }
        if (Second <= 9) {
            Second = '0' + Second
        }

        var filltime = day + '.' + month + '.' + year + ', ' + Hour + ':' + Minute + ':' + Second
        return filltime
    }
    // Построить календарь с событиями
    generateCalendar(events) {
        let temp = []
        for (let items = 0; items < 7; items++) {
            try {
                this.MatrixCalendar[items].map((nDay, index) => {
                    if (items === 0) {
                        temp.push(
                            <div className="calendar__day" id={nDay} key={temp.length}>{nDay}</div>
                        ); 
                    } else {
                        if (nDay === Datee.date && Year.year === new Date().getUTCFullYear() && Month.month === new Date().getUTCMonth()) {
                            temp.push(
                                <div className="calendar__number calendar__number-current" key={temp.length}>
                                    <div className="calendarNumber" calyear={Year.year} calmonth={Month.month} calday={nDay}>{nDay}</div>
                                    <div className="calendarEvents">
                                        {events.map((event, index) => {
                                            if (new Date(event.event_date).toLocaleString() === this.returnDatetime_locale(Year.year, Month.month+1, nDay, new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds())) {
                                                return (
                                                    <>
                                                    {/* <div eventid={event.event_id} className='CalendarEvent' style={{background: event.event_color}} onClick={(event) => {EventsBlock.SetChangeEvent()}}>{event.event_name}</div> */}
                                                    <div eventid={event.event_id} className='CalendarEvent' onClick={(event) => {EventsBlock.SetChangeEvent()}}>{event.event_name}</div>
                                                    </>
                                                )
                                            }     
                                        })}
                                    </div>
                                </div>
                            );
                        } else {
                            if (nDay === '' && items === 5 || nDay === '' && items === 6) {

                            } else {
                                temp.push(
                                    <div className="calendar__number" key={temp.length}>
                                        <div className="calendarNumber" calyear={Year.year} calmonth={Month.month} calday={nDay}>{nDay}</div>
                                        <div className="calendarEvents">
                                            {/* {events.map((event, index) => {
                                                if (new Date(event.event_date).toLocaleString() === this.returnDatetime_locale(Year.year, Month.month+1, nDay, new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds())) {
                                                    return (
                                                        <div eventid={event.event_id} className='CalendarEvent' style={{background: event.event_color}} onClick={(event) => {EventsBlock.SetChangeEvent()}}>{event.event_name}</div>
                                                    )
                                                }     
                                            })} */}
                                            {events.map((event, index) => {
                                                if (new Date(event.event_date).toLocaleString() === this.returnDatetime_locale(Year.year, Month.month+1, nDay, new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds())) {
                                                    return (
                                                        <div eventid={event.event_id} className='CalendarEvent' onClick={(event) => {EventsBlock.SetChangeEvent()}}>{event.event_name}</div>
                                                    )
                                                }     
                                            })}
                                        </div>
                                    </div>
                                );
                            }
                        }   
                    }
                }) 
            } catch (e) {
                
            }
        }
        this.nMatrixDays = temp
    }
    // Получить список календарей fetch("/calendar-list")
    async getCalendarList() {

        const res2 = await fetch("/calendar-list");
        const CalendarList = res2.json();
        
        const temp = await CalendarList.then(value => {
            return value
        })

        let result = await temp

        this.CalendarList = result
    }
    // Переключался менюшки отображения блока создания календаря
    SetNewCalendar() {
        this.NewCalendar = !this.NewCalendar
    }
    // Запись введённых данных о новом календаре
    NewCalendarChangeInfo(event) {
        if (event === 'Мои календари' || event === 'Календари отделов') {
            this.NewCalendarInfo['calendar_type'] = event
        } else {
            this.NewCalendarInfo[event.target.className] = event.target.value
        }
    }
    // Создать новый календарь
    CreateNewCalendar() {
        let temp = {}
        temp.CalendarInputName = this.NewCalendarInfo['CalendarInputName']
        if (this.NewCalendarInfo['calendar_type'] === 'Мои календари' || this.NewCalendarInfo['calendar_type'] === 'Календари отделов') {
            if (this.NewCalendarInfo['calendar_type'] === 'Мои календари') {
                temp.calendar_type = 'My'
            } else {
                temp.calendar_type = 'Department'
            }
        }
        if (this.NewCalendarInfo['calendar_type'] === '') {
            temp.calendar_type = 'My'
        }
        temp.creator_id = localStorage['LastUserId']

        fetch('/create-calendar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
            body: JSON.stringify(temp)
          }).then(function(response) {
            if (response.status === 400) {
                EventsBlock.SetErrorEvent()
            } else if (response.status === 200) {
                EventsBlock.SetPassedEvent()
            }
            return response.json()
          });
    }
    // Очистить поле информации о новом календаре
    restoreNewCalendarInput() {
        this.NewCalendarInfo['CalendarInputName'] = ''
        this.NewCalendarInfo['calendar_type'] = ''
    }
    // Удалить календарь из БД по названию и отделу в котором находится календарь
    deleteCalendarByName() {

        if (this.DeleteCalendarInfo['calendar_type'] === '' || this.DeleteCalendarInfo['calendar_name'] === '') {
            return 0
        }
        
        let temp = {}
        if (this.DeleteCalendarInfo['calendar_type'] === 'Мои календари' || this.DeleteCalendarInfo['calendar_type'] === 'Календари отделов') {
            if (this.DeleteCalendarInfo['calendar_type'] === 'Мои календари') {
                temp.calendar_type = 'My'
            } else {
                temp.calendar_type = 'Department'
            }
        }
        temp.calendar_name = this.DeleteCalendarInfo['calendar_name']
        temp.user_id = localStorage['LastUserId']

        fetch('/delete-calendar', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
            body: JSON.stringify(temp)
          }).then(function(response) {
            if (response.status === 400) {
                EventsBlock.SetErrorEvent()
            } else if (response.status === 200) {
                EventsBlock.SetPassedEvent()
            }
            return response.json()
          });
    }
    // Переключалка менюшки отображаниея календаря
    SetDeleteCalendar() {
        this.DeleteCalendar = !this.DeleteCalendar
    }
    // Сбросить все поля в блоке удаления календаря
    SetDeleteCalendarInfo() {
        this.DeleteCalendarInfo['DeleteCalendarInput'] = ''
        this.DeleteCalendarInfo['calendar_type'] = ''
    }
    // Изменить данные в переменной блока удаления календаря
    SetDeleteCalendarChangeInfo(event) {
        if (event === 'Мои календари' || event === 'Календари отделов') {
            this.DeleteCalendarInfo['calendar_type'] = event
        } else {
            this.DeleteCalendarInfo['calendar_name'] = event.target.value
        }
    }
}

export default new Calendar()
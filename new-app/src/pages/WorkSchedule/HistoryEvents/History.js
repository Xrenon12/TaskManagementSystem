import React, { useEffect } from 'react';
import Datee from '../../../mobx/Date';
import Month from '../../../mobx/Month';
import ShowEventsList from '../../../mobx/ShowEventsList';
import Year from '../../../mobx/Year';
import { observer } from 'mobx-react-lite';

import './style.css';
import { toJS } from "mobx";
import Calendar from '../../../mobx/Calendar';
import EventsBlock from '../../../mobx/Events';

const HistoryEventsBlock = observer(() =>  {

    // Получить даты конца/начала недели
    function getWeekDays(WeekDate) {
        let month = ''
        let day = ''
        if (WeekDate.getUTCMonth()+1 < 10) {
            month = '0' + (WeekDate.getUTCMonth()+1)
        } else {month = WeekDate.getUTCMonth()+1}
        if (WeekDate.getDate() < 10) {
            day = '0' + WeekDate.getDate()
        } else {day = WeekDate.getDate()}
        return WeekDate.getFullYear() + '-' + month + '-' + day
    }

    useEffect(() => {
        generateHistoryEventList()
    },[EventsBlock.updateScreen, ShowEventsList.EventsList])

    function subtractHours(numOfHours, date = new Date()) {
        date.setHours(date.getHours() - numOfHours);
      
        return date;
      }

    function generateHistoryEventList() {
        let temp = []
        ShowEventsList.getEventListCurrentMonth(Month.curMonth)
        for (let items = 0; items < ShowEventsList.EventListCurrentMonth.length; items++) {

            const date = new Date(ShowEventsList.EventListCurrentMonth[items]['event_date']).toLocaleString().split(',')
            const date2 = new Date(ShowEventsList.EventListCurrentMonth[items]['event_date'])

            let month = Month.curMonth;
            let day = Datee.date

            if (month < 10) {
                month = '0' + month
            }
            if (day < 10) {
                day = '0' + day
            }
            const curDay = day + '.' + month + '.' + Year.curYear

            let first_day_week = ''
            let last_day_week = ''

            var dt = new Date(); // current date of week
            var currentWeekDay = dt.getDay();
            var lessDays = currentWeekDay == 0 ? 6 : currentWeekDay - 1;
            var wkStart = new Date(new Date(dt).setDate(dt.getDate() - lessDays));
            var wkEnd = new Date(new Date(wkStart).setDate(wkStart.getDate() + 6));
            
            // Первый день недели
            first_day_week = getWeekDays(wkStart)
            // Последний день недели
            last_day_week = getWeekDays(wkEnd)

            // console.log(EventsBlock.getAllEventsDates(ShowEventsList.EventsList[items]['event_id'], 0))
            let event_dates_list = EventsBlock.getAllEventsDates(ShowEventsList.EventListCurrentMonth[items]['event_id'], 1)
            // console.log(event_dates_list)

            if ((date[0] === curDay || curDay in event_dates_list) && ShowEventsList.ThisDay === true) {
                if (temp.length === 0) {
                    temp.push(
                        <div className='HistoryEvents' key={items}>
                            <div className='HistoryEventItem'>
                                <div className='EventItemTitle'>Сегодня {curDay}</div>
                                <div className='EventBody'>
                                    <div className='EventColorMark' style={{background: ShowEventsList.EventListCurrentMonth[items]['event_color']}}></div>
                                    <div className='EventItemBody'>{ShowEventsList.EventListCurrentMonth[items]['event_name']}</div>
                                    <div className='EventItemTime'>{date[1]}</div>
                                </div>
                            </div>
                        </div>
                    )
                } else {
                    temp.push(
                        <div className='HistoryEvents' key={items}>
                            <div className='HistoryEventItem'>
                                <div className='EventBody'>
                                    <div className='EventColorMark' style={{background: ShowEventsList.EventListCurrentMonth[items]['event_color']}}></div>
                                    <div className='EventItemBody'>{ShowEventsList.EventListCurrentMonth[items]['event_name']}</div>
                                    <div className='EventItemTime'>{date[1].split('.')[0]}</div>
                                </div>
                            </div>
                        </div>
                    )
                }
            } else {
                console.log(ShowEventsList.EventListCurrentMonth[items])
                event_dates_list = EventsBlock.getAllEventsDates(ShowEventsList.EventListCurrentMonth[items]['event_id'], 1)
                // console.log(event_dates_list)
                
                let dates_list_week = EventsBlock.getAllEventsDates('None', 1, new Date(Year.year, month-1, 1), new Date(Year.year, month, 0))
                // console.log(dates_list_week)
                let dates = []
                // Object.keys(dates_list_week).map(key => {
                //     let x = dates_list_week[key].split('.')
                //     dates.push(new Date(x[2], x[1]-1, x[0]))
                // })
                // dates = dates.reduce((a, v) => ({ ...a, [v]: v}), {})
                // console.log(new Date(Year.year, month-1, 1) in dates, new Date(Year.year, month, 0) in dates)
                // console.log(event_dates_list)
                // console.log(dates_list_week)

                if (((new Date(Year.year, month-1, 1) <= date2 && new Date(Year.year, month, 0) >= date2)) && ShowEventsList.ThisMonth === true) {
                    if (temp.length === 0) {
                        temp.push(
                            <div className='HistoryEvents' key={items}>
                                <div className='HistoryEventItem'>
                                    <div className='EventItemTitle'>Задачи за {Calendar.Month[month-1]}</div>
                                    <div className='EventBody'>
                                        <div className='EventColorMark' style={{background: ShowEventsList.EventListCurrentMonth[items]['event_color']}}></div>
                                        <div className='EventItemBody'>{ShowEventsList.EventListCurrentMonth[items]['event_name']}</div>
                                        <div className='EventItemTime'>{date[1]}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        temp.push(
                            <div className='HistoryEvents' key={items}>
                                <div className='HistoryEventItem'>
                                    <div className='EventBody'>
                                        <div className='EventColorMark' style={{background: ShowEventsList.EventListCurrentMonth[items]['event_color']}}></div>
                                        <div className='EventItemBody'>{ShowEventsList.EventListCurrentMonth[items]['event_name']}</div>
                                        <div className='EventItemTime'>{date[1].split('.')[0]}</div>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                } else {
                    if (subtractHours(3, new Date(first_day_week)) <= date2 && new Date(last_day_week) >= date2 && ShowEventsList.ThisWeek === true) {
                        if (temp.length === 0) {
                            temp.push(
                                <div className='HistoryEvents' key={items}>
                                    <div className='HistoryEventItem'>
                                        <div className='EventItemTitle'>Задачи за неделю</div>
                                        <div className='EventBody'>
                                            <div className='EventColorMark' style={{background: ShowEventsList.EventListCurrentMonth[items]['event_color']}}></div>
                                            <div className='EventItemBody'>{ShowEventsList.EventListCurrentMonth[items]['event_name']}</div>
                                            <div className='EventItemTime'>{date[1]}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        } else {
                            temp.push(
                                <div className='HistoryEvents' key={items}>
                                    <div className='HistoryEventItem'>
                                        <div className='EventBody'>
                                            <div className='EventColorMark' style={{background: ShowEventsList.EventListCurrentMonth[items]['event_color']}}></div>
                                            <div className='EventItemBody'>{ShowEventsList.EventListCurrentMonth[items]['event_name']}</div>
                                            <div className='EventItemTime'>{date[1].split('.')[0]}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                    }
                }
            }
        }
        ShowEventsList.ChangeEventFilter(temp)
    }

    return (
        <div className='HistoryFrame'>
            <div className='HistoryPadding'>
                <div className='HistoryShowEvents'>
                    <div className='ShowEventTitle'>Показать события:</div>
                    <select onChange={(event) => {ShowEventsList.HistoryEventChoise(event); generateHistoryEventList()}}> 
                        <option>Текущий день</option>
                        <option>Текущая неделя</option>
                        <option>Текущий месяц</option>
                    </select>
                </div>
                {toJS(ShowEventsList.EventFilter)}
            </div>
        </div>
    )
})

export default HistoryEventsBlock;
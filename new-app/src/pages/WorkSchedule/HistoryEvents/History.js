import React, { useEffect } from 'react';
import Datee from '../../../mobx/Date';
import Month from '../../../mobx/Month';
import ShowEventsList from '../../../mobx/ShowEventsList';
import Year from '../../../mobx/Year';
import { observer } from 'mobx-react-lite';

import './style.css';
import { toJS } from "mobx";
import EventsBlock from '../../../mobx/Events';

import HistoryCurrentDay from '../../../components/jsxHistoryEvents.js/CurrentDay';

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

        for (let items = 0; items < ShowEventsList.EventsList.length; items++) {

            const date = new Date(ShowEventsList.EventsList[items]['event_date']).toLocaleString().split(',')
            const date_to = new Date(ShowEventsList.EventsList[items]['event_date_to']).toLocaleString().split(',')

            const date_only_time = (date[1].split(':')[0] + ':' + date[1].split(':')[1])
            const date_to_only_time = (date_to[1].split(':')[0] + ':' + date_to[1].split(':')[1])

            const date2 = new Date(ShowEventsList.EventsList[items]['event_date'])

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

            let event_dates_list = EventsBlock.getAllEventsDates(ShowEventsList.EventsList[items]['event_id'], 1)

            if ((date[0] === curDay || curDay in event_dates_list) && ShowEventsList.ThisDay === true) {
                // Текущий день
                if (temp.length === 0) {
                    // Текущий день
                    temp.push(
                        <HistoryCurrentDay items={items} curDay={curDay} date_only_time={date_only_time} date_to_only_time={date_to_only_time} title={'DayEventWithTitle'}/>
                    )
                } else {
                    // События текущего дня (без надписи Сегодня {curDay})
                    temp.push(
                        <HistoryCurrentDay items={items} curDay={curDay} date_only_time={date_only_time} date_to_only_time={date_to_only_time} title={'DayEvents'}/>
                    )
                }
            } else {
                event_dates_list = EventsBlock.getAllEventsDates(ShowEventsList.EventsList[items]['event_id'], 1)
                let dates_list_week = EventsBlock.getAllEventsDates('None', 1, new Date(Year.year, month-1, 1), new Date(Year.year, month, 0))
                let Continue = false
                Object.keys(event_dates_list).map(key => {
                    if (key in dates_list_week) {
                        Continue = true
                    }
                })

                if (((new Date(Year.year, month-1, 1) <= date2 && new Date(Year.year, month, 0) >= date2) || Continue === true) && ShowEventsList.ThisMonth === true) {
                    let StartDate = Datee.getDate(ShowEventsList.EventsList[items]['event_date'])
                    let Closedate = Datee.getDate(ShowEventsList.EventsList[items]['event_date_to'])
                    
                    // События за месяц
                    if (temp.length === 0) { 
                        if (StartDate === Closedate) {
                            temp.push(
                                <HistoryCurrentDay items={items} curDay={curDay} date_only_time={date_only_time} date_to_only_time={date_to_only_time} month={month} title={'MonthEventWithTitleHours'}/>
                            )
                        } else {
                            // События за месяц
                            temp.push(
                                <HistoryCurrentDay items={items} curDay={curDay} StartDate={StartDate} Closedate={Closedate} month={month} title={'MonthEventsWithTitle'}/>
                            )
                        }
                    } else {
                        // События за месяц (Без надписи Задачи за {Calendar.Month[month-1]})
                        if (StartDate === Closedate) {
                            temp.push(
                                <HistoryCurrentDay items={items} curDay={curDay} date_only_time={date_only_time} date_to_only_time={date_to_only_time} month={month} title={'MonthEventsHours'}/>
                            )
                        } else {
                            temp.push(
                                <HistoryCurrentDay items={items} curDay={curDay} StartDate={StartDate} Closedate={Closedate} month={month} title={'MonthEvents'}/>
                            )
                        }
                    }
                } else {
                    event_dates_list = EventsBlock.getAllEventsDates(ShowEventsList.EventsList[items]['event_id'], 1)
                    let dates_list_week = EventsBlock.getAllEventsDates('None', 1, first_day_week, last_day_week)
                    let Continue = false
                    Object.keys(event_dates_list).map(key => {
                        if (key in dates_list_week) {
                            Continue = true
                        }
                    })

                    if (((subtractHours(3, new Date(first_day_week)) <= date2 && new Date(last_day_week) >= date2) || Continue === true) && ShowEventsList.ThisWeek === true) {
                        let StartDate = Datee.getDate(ShowEventsList.EventsList[items]['event_date'])
                        let Closedate = Datee.getDate(ShowEventsList.EventsList[items]['event_date_to'])

                        // События за неделю
                        if (temp.length === 0) {
                            if (StartDate === Closedate) {
                                temp.push(
                                    <HistoryCurrentDay items={items} curDay={curDay} date_only_time={date_only_time} date_to_only_time={date_to_only_time} title={'WeekEventWithTitleHours'}/>
                                )
                            } else {
                                temp.push(
                                    <HistoryCurrentDay items={items} curDay={curDay} date_only_time={date_only_time} date_to_only_time={date_to_only_time} title={'WeekEventsWithTitle'}/>
                                )
                            }
                        } else {
                            if (StartDate === Closedate) {
                                // События за неделю (Без надписи Задачи на неделю)
                                temp.push(
                                    <HistoryCurrentDay items={items} curDay={curDay} date_only_time={date_only_time} date_to_only_time={date_to_only_time} title={'WeekEventsHours'}/>
                                )
                            } else {
                                // События за неделю (Без надписи Задачи на неделю)
                                temp.push(
                                    <HistoryCurrentDay items={items} curDay={curDay} StartDate={StartDate} Closedate={Closedate} title={'WeekEvents'}/>
                                )
                            }
                            
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
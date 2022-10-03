import React, { useState, useEffect } from "react";
import { Link } from 'react-router-dom'
import HistoryEventsBlock from "../HistoryEvents/History";

import './style.css';

import Month from "../../../mobx/Month";
import Year from "../../../mobx/Year";
import Calendar from "../../../mobx/Calendar";
import ShowEventsList from "../../../mobx/ShowEventsList";
import UserInfo from "../../../mobx/UserInfo";

export default function WorkSchedule(props) {

    useEffect(() => {
        Calendar.generateMatrix();
        Calendar.generateCalendarWithoutEvents();
    }, [ShowEventsList.EventsList])
    
    // Получить название текущего дня
    function getNameCurDay() {
        const date = new Date(Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), props.curDay))
        const curDay = date.getDay()
        switch (curDay) {
            case 0:
                return 'Воскресенье';
            case 1:
                return 'Понедельник';
            case 2:
                return 'Вторник';
            case 3:
                return 'Среда';
            case 4:
                return 'Четверг';
            case 5:
                return 'Пятница';
            case 6:
                return 'Суббота';
            default:
                return 'Неизвестная дата ' + curDay;
        }
    }

    return (
        <div className="calendar">
            <div className="calendar__picture">
                <h2 style={{fontSize: '19px'}}>Сегодня, {props.curDay}</h2>
                <h2>{getNameCurDay()}</h2>
                <Link to="/fullsize-work-schedule" className="calendar__month">{props.tableMonths[Month.month]} {Year.year}</Link>
                <div className="Navigator">
                    <div className="Prev" onClick={() => {Month.prev_month(); Calendar.generateMatrix(); Calendar.generateCalendarWithoutEvents(); Calendar.generateCalendar(ShowEventsList.EventsList); ShowEventsList.fetchNewEvents(UserInfo.UserInfo['schedule_id'])}}>Пред</div>
                    <Link to={`/profile/${localStorage.LastUserId}`} className="BackToProfile">Профиль</Link>
                    <div className="Next" onClick={() => {Month.next_month(); Calendar.generateMatrix(); Calendar.generateCalendarWithoutEvents(); Calendar.generateCalendar(ShowEventsList.EventsList); ShowEventsList.fetchNewEvents(UserInfo.UserInfo['schedule_id'])}}>След</div>
                </div>
            </div>
            <div className="calendar__date">
               {Calendar.nMatrixDaysWithoutEvents}
            </div>
            <HistoryEventsBlock />
        </div>
    )
}
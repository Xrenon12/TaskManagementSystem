import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import randomColor from "randomcolor";
import WorkScheduleCompact from '../compact/WorkSchedule'
import FilterWorkSchedule from '../filter/filter'
import { observer } from 'mobx-react-lite';
import Combobox from "react-widgets/Combobox";

import Month from '../../../mobx/Month';
import Year from '../../../mobx/Year';
import Calendar from '../../../mobx/Calendar';
import EventsBlock from '../../../mobx/Events';
import ShowEventsList from '../../../mobx/ShowEventsList';

import './style.css';
import "react-widgets/styles.css";
import Events from '../../../mobx/Events';
import date from '../../../mobx/Date'

import NotificationTime from '../../../components/NotificationUpdateble'

let nMatrixDays = []

const FullSizeWorkSchedule = observer(() => {

    useEffect(() => {
        // Получение информации о текущем пользователе и его событиях
        EventsBlock.fetchData()
        // Построение jsx разметки календаря
        createHtmlMarkup(Calendar.MatrixCalenda);
        
    },[EventsBlock.updateScreen])

    // Запрос на обновление информации события fetch('/event-update/' + EventsBlock.actualInfoAboutEvent[0].event_id
    function uploadNewEventInfo() {
        const body = {
            event_color: EventsBlock.actualInfoAboutEvent[0].event_color,
            event_name: EventsBlock.actualInfoAboutEvent[0].event_name,
            event_body: EventsBlock.actualInfoAboutEvent[0].event_body,
            event_date: EventsBlock.actualInfoAboutEvent[0].event_date,
            event_date_to: EventsBlock.actualInfoAboutEvent[0].event_date_to,
            event_notification_active: EventsBlock.actualInfoAboutEvent[0].event_notification_active,
            event_notification_time: EventsBlock.actualInfoAboutEvent[0].event_notification_time
        }
        fetch('/event-update/' + EventsBlock.actualInfoAboutEvent[0].event_id, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
            body: JSON.stringify(body)
          }).then(function(response) {
            if (response.status === 400) {
                EventsBlock.SetErrorEvent()
            } else if (response.status === 200) {
                EventsBlock.SetPassedChangeEvent()
            }
            return response.json()
          });
          EventsBlock.SetChangeEvent()
          EventsBlock.SetUpdateScreen()
    }
    // Обновляем информацию по событию в EventsBlock.actualInfoAboutEvent
    function CurrentEventChangeInfo(event) {

        let temp = Object.assign({}, EventsBlock.actualInfoAboutEvent[0]);
        switch(event.target.className) {
            case 'ColorMark':
                temp.event_color = event.target.value
                break
            case 'EventInputTitle':
                temp.event_name = event.target.value
                break
            case 'EventTextArea':
                temp.event_body = event.target.value
                break
            case 'EventDateInput':
                temp.event_date = event.target.value + ':00'
                break
            case 'EventDateToInput':
                temp.event_date_to = event.target.value + ':00'
                break
            case 'EventActiveNotificationStatus':
                temp.event_notification_active = event.target.checked
                break
            case 'EventNotificationTime':
                temp.event_notification_time = event.target.value + ':00'
                break
            default:
                console.log('Something failed')
        }

        EventsBlock.SetActualInfoAboutEvent([temp])
    }
    // Убрать классы с отключённых блоков уведомлений
    function updateDisplayError() {
        if (EventsBlock.ErrorEvent === false) {
            EventsBlock.SetErrorEvent()
        }
        if (EventsBlock.PassedEvent === false) {
            EventsBlock.SetPassedEvent()
        }
        if (EventsBlock.PassedChangeEvent === false) {
            EventsBlock.SetPassedChangeEvent()
        }
    }
    // Построить jsx разметку календаря с событиями
    function createHtmlMarkup() {
        let temp = []
        let counter = 0

        try {
            let counter = 0

            let firstDayLast = ''
            let firstDayLastmonth = ''
            let YearYear = ''
            let MonthMonth  = ''
            if (Month.month === 0) {
                YearYear = Year.year - 1
                MonthMonth = 12
                firstDayLast = new Date(YearYear, MonthMonth, 1).getDay();
                if (firstDayLast === 0) {
                    firstDayLast = 7
                }
                firstDayLastmonth = new Date(YearYear, MonthMonth, 0).getDate()
            } else {
                firstDayLast = new Date(Year.year, Month.month, 1).getDay();
                if (firstDayLast === 0) {
                    firstDayLast = 6
                }
                firstDayLastmonth = new Date(Year.year, Month.month, 0).getDate()
            }
            
            let ctr = 1

            Calendar.MatrixCalendar.map((nDay, index) => {
                if (index === 0) {
                    for (let items = 0; items < nDay.length; items++) {
                        temp.push(
                            <div className="calendar__day" key={counter}>{nDay[items]}</div>
                        );
                        counter =  counter + 1
                    }
                } else {
                    for (let items = 0; items < nDay.length; items++) {
                        if (nDay[items] === date.date && Year.year === new Date().getUTCFullYear() && Month.month === new Date().getUTCMonth()) {
                            temp.push(
                                <div className="calendar__number calendar__number-current" key={counter}>
                                    <div className="calendarNumber" calyear={Year.year} calmonth={Month.month} calday={nDay[items]} onClick={() => {EventsBlock.openCreateEvent(Year.year, Month.month, nDay[items])}}>{nDay[items]}</div>
                                    <div className="calendarEvents">
                                    {ShowEventsList.EventsList.map((event, index) => {
                                        // Добавление событий на текущий день
                                        const event_dates_list = EventsBlock.getAllEventsDates(event['event_id'])
                                        if (new Date(event.event_date).toLocaleString() === Calendar.returnDatetime_locale(Year.year, Month.month+1, nDay[items], new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) || Calendar.returnDatetime_locale(Year.year, Month.month+1, nDay[items], new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) in event_dates_list) {
                                            return (
                                                <div eventid={event.event_id} className='CalendarEvent' style={{background: event.event_color}} onClick={(event) => { EventsBlock.getInfoAboutEvent(event); EventsBlock.SetChangeEvent() }} key={index}>{event.event_name}</div>
                                            )
                                        }     
                                    })}
                                    </div>
                                </div>
                            );
                        } else {
                            if (nDay[items] === '' && index === 5 || nDay[items] === '' && index === 6) {
                                let Ok = false
                                for (let Index = 0; Index < nDay.length; Index++) {
                                    if (nDay[Index] !== '') {
                                        Ok = true
                                    }
                                }
                                if (Ok === true) {
                                    temp.push(
                                        <div className="calendar__number" key={counter} style={{'background': '#F6F6F6', 'color': '#707070'}}>
                                            <div className="calendarNumber">{ctr}</div>
                                            <div className="calendarEvents">
                                            {ShowEventsList.EventsList.map((event, index) => {
                                                // Серые дни
                                                const event_dates_list = EventsBlock.getAllEventsDates(event['event_id'])
                                                if (new Date(event.event_date).toLocaleString() === Calendar.returnDatetime_locale(Year.year, Month.month+2, ctr, new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) || Calendar.returnDatetime_locale(Year.year, Month.month+2, ctr, new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) in event_dates_list) {
                                                    return (
                                                        <div eventid={event.event_id} className='CalendarEvent' style={{background: event.event_color}} onClick={(event) => { EventsBlock.getInfoAboutEvent(event); EventsBlock.SetChangeEvent() }} key={index}>{event.event_name}</div>
                                                    )
                                                }     
                                            })}
                                            </div>
                                        </div>
                                    );
                                    ctr++
                                }
                            } else {
                                if (nDay[items] !== '') {
                                    temp.push(
                                        <div className="calendar__number" key={counter} style={{'background': 'rgba(255, 254, 232, 0.3)'}}>
                                            <div className="calendarNumber" calyear={Year.year} calmonth={Month.month} calday={nDay[items]} onClick={() => {EventsBlock.openCreateEvent(Year.year, Month.month, nDay[items])}}>{nDay[items]}</div>
                                            <div className="calendarEvents">
                                            <div className='FrameFrame'>
                                            {ShowEventsList.EventsList.map((event, index) => {
                                                // Добавление событий на все месячные дни
                                                const event_dates_list = EventsBlock.getAllEventsDates(event['event_id'])
                                                if (new Date(event.event_date).toLocaleString() === Calendar.returnDatetime_locale(Year.year, Month.month+1, nDay[items], new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) || Calendar.returnDatetime_locale(Year.year, Month.month+1, nDay[items], new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) in event_dates_list) {
                                                    return (
                                                        <div eventid={event.event_id} className='CalendarEvent' style={{background: event.event_color}} onClick={(event) => { EventsBlock.getInfoAboutEvent(event); EventsBlock.SetChangeEvent() }} key={index}>{event.event_name}</div>
                                                    )
                                                }     
                                            })}
                                            </div>
                                            </div>
                                        </div>
                                    );
                                } else {
                                    temp.push(
                                        <div className="calendar__number" key={counter} style={{'background': '#F6F6F6', 'color': '#707070'}}>
                                            <div className="calendarNumber">{firstDayLastmonth-firstDayLast+2}</div>
                                            <div className="calendarEvents">
                                            {ShowEventsList.EventsList.map((event, index) => {
                                                // Добавление событий на серые дни
                                                const event_dates_list = EventsBlock.getAllEventsDates(event['event_id'])
                                                if (new Date(event.event_date).toLocaleString() === Calendar.returnDatetime_locale(Year.year, Month.month, (firstDayLastmonth-firstDayLast+2), new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) || Calendar.returnDatetime_locale(Year.year, Month.month, (firstDayLastmonth-firstDayLast+2), new Date(event.event_date).getHours(), new Date(event.event_date).getMinutes(), new Date(event.event_date).getSeconds()) in event_dates_list) {
                                                    return (
                                                        <div eventid={event.event_id} className='CalendarEvent' style={{background: event.event_color}} onClick={(event) => { EventsBlock.getInfoAboutEvent(event); EventsBlock.SetChangeEvent() }} key={index}>{event.event_name}</div>
                                                    )
                                                }     
                                            })}
                                            </div>
                                        </div>
                                    );
                                    firstDayLast -= 1
                                }
                            }
                        }
                        counter =  counter + 1
                    }
                }
            }) 
        } catch (e) {
            
        }
        
        nMatrixDays = temp
        return nMatrixDays
    }
    // ОБработка нажатий кнопок
    document.addEventListener('keyup', (event) => {
        // Обновление информации о событии при нажатии на Enter
        if (EventsBlock.ChangeEvent === false && event.key === 'Enter') {
            uploadNewEventInfo();
            Events.fetchData()
        }
        // Создание нового события при нажатии на Enter
        if (EventsBlock.CreateEvent === false && event.key === 'Enter') {
            EventsBlock.createNewEvent()
        }
        // Закрытие окошка при нажатии на Escape
        if (event.key === 'Escape') {
            if (EventsBlock.CreateEvent === false) {
                EventsBlock.SetCreateEvent()
            }
            if (EventsBlock.ChangeEvent === false) {
                EventsBlock.SetChangeEvent()
            }
        }
    });

  return (
    <div className='RootFrame'>
        <NotificationTime />
        <WorkScheduleCompact curDay={date.date} tableMonths={Calendar.Month} weekDays={Calendar.weekDays} nDays={Calendar.nDays}/>
        <div className="fullScreenCalendar">
            <div className={`GrayFilter ${EventsBlock.CreateEvent ? ("") : ('activeHistory')} ${EventsBlock.HistoryEvent ? ("") : ('activeHistory')} ${EventsBlock.ChangeEvent ? ("") : ('change-active')} ${EventsBlock.DeleteEvent ? ("") : ('Trash-active')} ${EventsBlock.SearchEvent ? ("") : ('SearchEvent-active')} ${Calendar.NewCalendar ? ("") : ('Calendar-active')} ${Calendar.DeleteCalendar ? ("") : ('DeleteCalendar-active')}`}></div>
            <div className='calendarTitle'>
                <div></div>
                <Link className="caledar_month" to={`/profile/${localStorage['LastUserId']}`}>{Calendar.Month[Month.month]}</Link>
                <div className='EventsBtn'>
                    <div className='BtnCreateEvent' onClick={() => {EventsBlock.openCreateEvent()}}></div>
                    {/* <div className='BtnHistoryEvents' onClick={() => {EventsBlock.SetHistoryEvent()}}></div> */}
                </div>
                
            </div>
            <div className="calendar__date">
                {createHtmlMarkup()}
            </div>
            <div className={`history_event ${EventsBlock.HistoryEvent ? ("") : ('activeHistory')}`}>
                <div className='EventFrame'>
                    <div className='BlockEvent'>
                        <div className='HistoryTitle'>Список событий</div>
                        <div className='HistoryList'>
                            <div id='HistScroll' className='HistoryScrooll'>
                                {ShowEventsList.EventsList.map((event, index) => {
                                    let color = randomColor({luminosity: 'light'});
                                    return (
                                        <div className='EventItemFrame' key={"fullSizeWorkSchedule" + index}>
                                            <div eventid={event.event_id} className='EventItemPadding' style={{background: event.event_color, borderRadius: '10px'}} onClick={(event) => {EventsBlock.getInfoAboutEvent(event); EventsBlock.SetChangeEvent()}}>
                                                <div eventid={event.event_id} className='EventItemTitle'>Дата события {new Date(event.event_date).toLocaleString()}</div>
                                                <div eventid={event.event_id} className='EventName'>{event.event_name}</div>
                                            </div>
                                        </div>   
                                    )
                                })}
                            </div>
                            <div className='EventBtnFrame'>
                                <div className='EventBtn' onClick={() => {EventsBlock.SetHistoryEvent()}}>Закрыть</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className={`CreateEventFrame ${EventsBlock.CreateEvent ? ("") : ('activeCreateEvent')}`}>
                <div className='BlockEvent'>
                    <div className='CreateEventTitle'>Новое событие</div>
                    <div className='CreateEvent'>
                        <div className='EventTitleBlock'>
                            <p className='EventTitle'>Название</p>
                            <div className='EventColorMark'>
                                <input type="color" className='ColorMark' onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} value={EventsBlock.NewEvent['ColorMark']}></input>
                            </div>
                            <input className='EventInputTitle' placeholder='Введите название события' onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} value={EventsBlock.NewEvent['EventInputTitle']}></input>
                        </div>
                        <div className='EventAboutBlock'>
                            <p className='EventAbout'>Описание</p>
                            <textarea className='EventTextArea' placeholder='Введите описание события' onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} value={EventsBlock.NewEvent['EventTextArea']}></textarea>
                        </div>
                        <div className='EventDateBlock'>
                            <p className='EventDate'>Дата события</p>
                            <input className='EventDateInput' placeholder='Формат ГГ-ММ-ДД ЧЧ:ММ:СС' type="datetime-local" onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} value={EventsBlock.NewEvent['EventDateInput']}></input>
                            <div className='split'>-</div>
                            <input className='EventDateToInput' placeholder='Формат ГГ-ММ-ДД ЧЧ:ММ:СС' type="datetime-local" onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} value={EventsBlock.NewEvent['EventDateToInput']}></input>
                        </div>
                        <div className='EventUsersListBlock'>
                            <p className='EventUsersList'>Участники</p>
                            <input className='EventUsersListInput' placeholder='Введите логин пользователя' onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} value={EventsBlock.NewEvent['EventUsersListInput']}></input>
                        </div>
                        <div className='EventNotificationsBlock'>
                            <p className='EventNotification'>Уведомления</p>
                            <div className='EventNotificationSettings'>
                                <div className='EventNotificationStatusBlock'>
                                    <input className='EventActiveNotificationStatus' type="checkbox" onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} checked={EventsBlock.NewEvent['EventNotificationActive']}></input>
                                    <p className='EventNotificationStatusTitle'>Включить рассылку</p>
                                </div>
                                <div className='EventNotificationTimeBlock'>
                                    <p className='EventNotificationtimeTitle'>Время рассылки</p>
                                    <input className='EventNotificationTime' placeholder='Формат ГГ-ММ-ДД ЧЧ:ММ' type="datetime-local" onChange={(event) => {EventsBlock.EventCreateChangeData(event)}} value={EventsBlock.NewEvent['EventNotificationTime']} disabled={EventsBlock.NewEvent['EventNotificationActive'] ? null : "Disabled"}></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='CreateEventBtnFrame'>
                        <div className='EventBtn' onClick={() => {EventsBlock.SetCreateEvent()}}>Закрыть</div>
                        <div className='EventBtnCreate' onClick={() => {EventsBlock.createNewEvent()}}>Создать</div>
                    </div>
                </div>
            </div>
            <div className={`pop-upNotification cancel ${EventsBlock.ErrorEvent ? ('') : ('notification-active')}`} onAnimationEnd={updateDisplayError}>
                <div className='Notification'>
                    Что-то пошло не так!
                </div>
            </div>
            <div className={`pop-upNotification passed ${EventsBlock.PassedEvent ? ('') : ('notification-active')}`} onAnimationEnd={updateDisplayError}>
                <div className='Notification'>
                    Событие было добавлено!
                </div>
            </div>
            <div className={`pop-upNotification passed passedChanged ${EventsBlock.PassedChangeEvent ? ('') : ('notification-active')}`} onAnimationEnd={updateDisplayError}>
                <div className='Notification'>
                    Изменения были сохранены!
                </div>
            </div>
            <div className={`ChangeEventFrame ${EventsBlock.ChangeEvent ? ("") : ('change-active')}`}>
                <div className='BlockEvent'>
                    {EventsBlock.actualInfoAboutEvent.map((item, index) => {
                        return (
                            <>
                                <div className='CreateEventTitle'>
                                    {JSON.parse(localStorage['UserPermissions'])['change_event']
                                    ?<div>Редактировать событие №{item.event_id}</div>
                                    :<div>Просмотр события №{item.event_id}</div>}
                                    {JSON.parse(localStorage['UserPermissions'])['delete_event']
                                    ?<div className='Trash' onClick={() => {EventsBlock.SetDeleteEvent()}}></div>:null}
                                </div>
                                <div className='CreateEvent'>
                                    <div className='EventTitleBlock'>
                                        <p className='EventTitle'>Название</p>
                                        <div className='EventColorMark'>
                                            <input type="color" className='ColorMark' onChange={CurrentEventChangeInfo} value={item.event_color}></input>
                                        </div>
                                        <input className='EventInputTitle' placeholder='Введите название события' onChange={CurrentEventChangeInfo} value={item.event_name}></input>
                                    </div>
                                    <div className='EventAboutBlock'>
                                        <p className='EventAbout'>Описание</p>
                                        <textarea className='EventTextArea' placeholder='Введите описание события' onChange={CurrentEventChangeInfo} value={item.event_body}></textarea>
                                    </div>
                                    <div className='EventDateBlock'>
                                        <p className='EventDate'>Дата события</p>
                                        <input className='EventDateInput' placeholder='Формат ГГ-ММ-ДД' type="datetime-local" onChange={CurrentEventChangeInfo} value={date.convertToDateTimeFormat(item.event_date)}></input>
                                        <div className='split'>-</div>
                                        <input className='EventDateToInput' placeholder='Формат ГГ-ММ-ДД ЧЧ:ММ:СС' type="datetime-local" onChange={CurrentEventChangeInfo} value={date.convertToDateTimeFormat(item.event_date_to)}></input>
                                    </div>
                                    <div className='EventUsersListBlock'>
                                        <p className='EventUsersList'>Участники</p>
                                        <input className='EventUsersListInput' placeholder='Введите логин пользователя' onChange={CurrentEventChangeInfo}></input>
                                    </div>
                                    <div className='EventNotificationsBlock'>
                                        <p className='EventNotification'>Уведомления</p>
                                        <div className='EventNotificationSettings'>
                                            <div className='EventNotificationStatusBlock'>
                                                <input className='EventActiveNotificationStatus' type="checkbox" onChange={CurrentEventChangeInfo} checked={item.event_notification_active}></input>
                                                <p className='EventNotificationStatusTitle'>Включить рассылку</p>
                                            </div>
                                            <div className='EventNotificationTimeBlock'>
                                                <p className='EventNotificationtimeTitle'>Время рассылки</p>
                                                <input className='EventNotificationTime' placeholder='Формат ГГ-ММ-ДД ЧЧ:ММ' type="datetime-local" onChange={CurrentEventChangeInfo} value={date.convertToDateTimeFormat(item.event_notification_time)} disabled={item.event_notification_active === true ? null : "disabled"}></input>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='CreateEventBtnFrame'>
                                    <div className='EventBtn' onClick={() => {EventsBlock.SetChangeEvent(); EventsBlock.SetActualInfoAboutEvent([])}}>Закрыть</div>
                                    {JSON.parse(localStorage['UserPermissions'])['change_event']
                                    ?<div className='EventBtnCreate' onClick={(event) => {uploadNewEventInfo(event); Events.fetchData()}}>Обновить</div>:null}
                                </div>
                            </>
                        )
                    })}
                </div>
            </div>
            <div className={`DeleteEvent ${EventsBlock.DeleteEvent ? ("") : ('change-active')}`}>
                <div className='BlockEvent'>
                    <div className='CreateEventTitle'>
                        <div>Удалить событие</div>
                    </div>
                    <div className='DeleteBlock'>
                        <p>Вы действительно хотите удалить это событие?</p>
                    </div>
                    <div className='CreateEventBtnFrame'>
                        <div className='EventBtn' onClick={() => {EventsBlock.SetDeleteEvent()}}>Закрыть</div>
                        <div className='EventBtnCreate' onClick={() => {EventsBlock.deleteEvent()}}>Удалить</div>
                    </div>
                </div>
            </div>
            <div className={`SearchEvent ${EventsBlock.SearchEvent ? ("") : ('SearchEvent-active')}`}>
                <div className='BlockEvent'>
                    <div className='ChoiceEventTitle'>
                        <div>Поиск события</div>
                    </div>
                    <div className='ChoiceEventBlock'>
                        <input className='ChoiseEventInput' type="text" placeholder='Введите № события' value={EventsBlock.actualEventId} onChange={(event) => {EventsBlock.SearchEventById(event.target.value)}}></input>
                    </div>
                    <div className='CreateEventBtnFrame ChoiceEventBlockBtn'>
                        <div className='EventBtn' onClick={() => {EventsBlock.SetSearchEvent(); EventsBlock.SetDefaultEventId()}}>Закрыть</div>
                        <div className='EventBtnCreate ChoiceBtnSearch' onClick={() => {EventsBlock.SetSearchEvent(); EventsBlock.SetChangeEvent(); EventsBlock.SetDefaultEventId()}}>Поиск</div>
                    </div>
                </div>
            </div>
            <div className={`CreateNewCalendar ${Calendar.NewCalendar ? ("") : ('Calendar-active')}`} >
                <div className='BlockCalendar BlockEvent'>
                    <div className='CalendarTitle'>
                        <div>Создать календарь</div>
                    </div>
                    <div className='NewCalendarBlock'>
                        <div className='CalendarBlockTitle CalendarBlockItem'>
                            <div className='CalendarName'>Название</div>
                            <input className='CalendarInputName' placeholder='Введите название календаря' onChange={(event) => {Calendar.NewCalendarChangeInfo(event)}} value={Calendar.NewCalendarInfo['CalendarInputName']}></input>
                        </div>
                        <div className='CalendarBlockItem CalendarTypeBlock'>
                            <div className='CalendarType'>Тип календаря</div>
                            {JSON.parse(localStorage['UserPermissions'])['create_department_calendar'] ?
                            (
                                <Combobox
                                    defaultValue=""
                                    data={["Мои календари", "Календари отделов"]}
                                    onChange={(event) => {
                                        Calendar.NewCalendarChangeInfo(event);
                                    }}
                                    value={Calendar.NewCalendarInfo['calendar_type']}
                                />
                            ) : 
                            (
                                <Combobox
                                    defaultValue=""
                                    data={["Мои календари"]}
                                    onChange={(event) => {
                                        Calendar.NewCalendarChangeInfo(event);
                                    }}
                                    value={Calendar.NewCalendarInfo['calendar_type']}
                                />
                            )
                            }
                        </div>
                    </div>
                    <div className='CreateEventBtnFrame NewCalendarBtn'>
                        <div className='EventBtn' onClick={() => {Calendar.SetNewCalendar(); Calendar.restoreNewCalendarInput()}}>Закрыть</div>
                        <div className='EventBtnCreate NewCalendarBtnCreate' onClick={() => {Calendar.CreateNewCalendar(); Calendar.SetNewCalendar(); Calendar.getCalendarList(); Calendar.restoreNewCalendarInput()}}>Создать</div>
                    </div>
                </div>
            </div>
            <div className={`DeleteCalendarByName ${Calendar.DeleteCalendar ? ("") : ('DeleteCalendar-active')}`}>
                <div className='BlockEvent'>
                    <div className='DeleteCalendarTitle'>
                        <div>Удалить календарь</div>
                    </div>
                    <div className='DeleteBlockInput'>
                        <div className='DeleteBlockTitle'>Название календаря:</div>
                        <input className='DeleteCalendarInput' placeholder='Введите название календаря' onChange={(event) => {Calendar.SetDeleteCalendarChangeInfo(event)}} value={Calendar.DeleteCalendarInfo['DeleteCalendarInput']}></input>
                    </div>
                    <div className='CalendarBlockItem CalendarTypeBlock'>
                        <div className='CalendarType'>Тип календаря</div>
                        {JSON.parse(localStorage['UserPermissions'])['delete_department_calendar'] ?
                            (
                                <Combobox
                                    defaultValue=""
                                    data={["Мои календари", "Календари отделов"]}
                                    onChange={(event) => {
                                        Calendar.SetDeleteCalendarChangeInfo(event);
                                    }}
                                    value={Calendar.NewCalendarInfo['calendar_type']}
                                />
                            ) : 
                            (
                                <Combobox
                                    defaultValue=""
                                    data={["Мои календари"]}
                                    onChange={(event) => {
                                        Calendar.SetDeleteCalendarChangeInfo(event);
                                    }}
                                    value={Calendar.NewCalendarInfo['calendar_type']}
                                />
                            )
                        }
                    </div>
                    <div className='DeleteCalendarFrame'>
                        <div className='EventBtn CalendarBtn' onClick={() => {Calendar.SetDeleteCalendar(); Calendar.SetDeleteCalendarInfo()}}>Закрыть</div>
                        <div className='EventBtnCreate CalendarBtnDelete' onClick={() => {Calendar.deleteCalendarByName(); Calendar.SetDeleteCalendar();}}>Удалить</div>
                    </div>
                </div>
            </div>
        </div>
        <FilterWorkSchedule />
    </div>
  );
})

export default FullSizeWorkSchedule;
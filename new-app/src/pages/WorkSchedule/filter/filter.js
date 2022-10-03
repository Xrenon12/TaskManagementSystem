import React, { useEffect } from 'react';
import Calendar from '../../../mobx/Calendar';
import EventsBlock from '../../../mobx/Events'
import UserInfo from '../../../mobx/UserInfo';

import './style.css';

const FilterWorkSchedule = () => {

    useEffect(() => {
        // Получить список календарей
        Calendar.getCalendarList()
        UserInfo.getSubordinatesList()
    }, [])

    return (

        <div className='FilterBody'>
            <div className='Actions FilterBlocks'>
                <div className='FilterFrame'>
                    <div className='FiterTitle'>Действия с календарём</div>
                    {JSON.parse(localStorage['UserPermissions'])['add_event']
                    ? <div className='FilterBtn FilterCreateEvent' onClick={() => {EventsBlock.openCreateEvent()}}>Создать событие</div>:null}
                    {JSON.parse(localStorage['UserPermissions'])['search_event']
                    ? <div className='FilterBtn FilterOpenEvent' onClick={() => {EventsBlock.SetSearchEvent()}}>Поиск событие</div>:null}
                    {JSON.parse(localStorage['UserPermissions'])['create_my_calendar'] || JSON.parse(localStorage['UserPermissions'])['create_department_calendar']
                    ? <div className='FilterBtn FilterOpenEvent' onClick={() => {Calendar.SetNewCalendar()}}>Создать календарь</div>:null}
                    {JSON.parse(localStorage['UserPermissions'])['delete_my_calendar'] || JSON.parse(localStorage['UserPermissions'])['delete_department_calendar']
                    ? <div className='FilterBtn FilterOpenEvent' onClick={() => {Calendar.SetDeleteCalendar()}}>Удалить календарь</div>:null}
                </div>
            </div>
            <div className='MyCalendar FilterBlocks'>
                <div className='FilterFrame'>
                    <div className='FiterTitle'>Мои календари</div>
                    {Calendar.CalendarList.map((element) => {
                        if (element['calendar_type'] === 'My' && element['creator_id'] === UserInfo.UserInfo['user_id']) {
                            if (UserInfo.UserInfo['schedule_id'] !== element['calendar_id']) {
                                return (
                                    <div eventid={element['calendar_id']} className='FilterBtn FilterRadioButton' key={element['calendar_id']} onClick={(event) => {UserInfo.updateUserCalendarId(parseInt(event.target.attributes[0].nodeValue))}}>{element['calendar_name']}</div>
                                )
                            } else {
                                return (
                                    <div eventid={element['calendar_id']} className='FilterBtn FilterRadioButton Checked' key={element['calendar_id']}>{element['calendar_name']}</div>
                                )
                            }
                        }
                    })}
                </div>
            </div>
            <div className='DepartmentCalendar FilterBlocks'>
                <div className='FilterFrame'>
                    <div className='FiterTitle'>Календари отделов</div>
                    {Calendar.CalendarList.map((element) => {
                        if (element['calendar_type'] === 'Department') {
                            if (UserInfo.UserInfo['schedule_id'] !== element['calendar_id']) {
                                return (
                                    <div eventid={element['calendar_id']} className='FilterBtn FilterRadioButton' key={element['calendar_id']} onClick={(event) => {UserInfo.updateUserCalendarId(parseInt(event.target.attributes[0].nodeValue))}}>{element['calendar_name']}</div>
                                )
                            } else {
                                return (
                                    <div eventid={element['calendar_id']} className='FilterBtn FilterRadioButton Checked' key={element['calendar_id']}>{element['calendar_name']}</div>
                                )
                            }
                        }
                    })}
                </div>
            </div>
            <div className='UsersCalendar FilterBlocks'>
            <div className='FilterFrame'>
                    <div className='FiterTitle'>Календари пользователей</div>
                    {UserInfo.SubordinatesList.map((element, index) => {
                        if (element.length !== 0) {
                            if (UserInfo.UserInfo['schedule_id'] === element['schedule_id']) {
                                return (
                                    <div eventid={element['schedule_id']} className='FilterBtn FilterUserCalendar FilterRadioButton Checked' key={index} onClick={(event) => {UserInfo.updateUserCalendarId(parseInt(event.target.attributes[0].nodeValue))}}>{element['surname']} {element['name']}</div>
                                )
                            } else {
                                return (
                                    <div eventid={element['schedule_id']} className='FilterBtn FilterUserCalendar FilterRadioButton' key={index} onClick={(event) => {UserInfo.updateUserCalendarId(parseInt(event.target.attributes[0].nodeValue))}}>{element['surname']} {element['name']}</div>
                                )
                            }
                            
                        } else {}
                        
                    })}
                </div>
            </div>
        </div>

    )

}

export default FilterWorkSchedule
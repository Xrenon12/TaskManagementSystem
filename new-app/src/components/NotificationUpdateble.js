import "react-widgets/styles.css";
import { useEffect, useState } from 'react';
import ShowEventsList from "../mobx/ShowEventsList";
import Year from "../mobx/Year";
import Month from "../mobx/Month";

function NotificationTime() {

    const [TimeBase64, SetTimeBase64] = useState(0)
    const [Time, SetTime] = useState(0)

    function notification(event_id, event_name, event_body, event_time) {
        const EventDate = new Date(event_time)
        Notification.requestPermission(function(permission){
            // переменная permission содержит результат запроса
            var notification = new Notification(`№${event_id}. ${event_name}`,
            { body: `${event_body} \n${EventDate.toLocaleDateString()} ${EventDate.toLocaleTimeString()}`, dir: 'auto', icon: 'https://img.icons8.com/color/344/40-percents.png' });
        });
    }

    useEffect(() => {
        const timer = setTimeout(() => {
            let Minutes = new Date().getUTCMinutes()
            if (Minutes < 10) {
                Minutes = '0' + Minutes
            }
            let Hours = new Date().getUTCHours()
            if (Hours < 10) {
                Hours = '0' + Hours
            }
            let date = new Date().getDate()
            if (date < 10) {
                date = '0' + date
            }
            let month = Month.month+1
            if (month < 10) {
                month = '0' + month
            }
            let second = new Date().getSeconds()
            if (second < 10) {
                second = '0' + second
            }
            SetTime(Year.year + '-' + month + '-' + date + 'T' +  Hours + ':' + Minutes + ':' + second)
            SetTimeBase64(new Date().getTime())
            for (let items = 0; items < ShowEventsList.EventsList.length; items++) {
                if (ShowEventsList.EventsList[items]['event_notification_time'] !== null && ShowEventsList.EventsList[items]['event_notification_active'] === true) {
                    if (ShowEventsList.EventsList[items]['event_notification_time'].split('.')[0] === Time && ShowEventsList.EventsList[items]['user_id'] === localStorage['LastUserId']) {
                        notification(ShowEventsList.EventsList[items]['event_id'], ShowEventsList.EventsList[items]['event_name'], ShowEventsList.EventsList[items]['event_body'], ShowEventsList.EventsList[items]['event_date'])
                    }
                }
            }
          }, 1000);
        return () => clearTimeout(timer);
    }, [TimeBase64])

}

export default NotificationTime
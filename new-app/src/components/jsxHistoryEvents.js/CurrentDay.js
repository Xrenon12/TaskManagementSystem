import ShowEventsList from "../../mobx/ShowEventsList"
import Calendar from "../../mobx/Calendar"

function HistoryCurrentDay(props) {
    if (ShowEventsList.EventsList[props.items] !== undefined) {
        switch(props.title) {
            case 'DayEventWithTitle':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventItemTitle'>Сегодня {props.curDay}</div>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.date_only_time} - {props.date_to_only_time}</div>
                            </div>
                        </div>
                    </div>
                )
            case 'DayEvents':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.date_only_time} - {props.date_to_only_time}</div>
                            </div>
                        </div>
                    </div>
                )
            case 'WeekEventWithTitleHours':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventItemTitle'>Задачи за неделю</div>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.date_only_time.split(':')[0]+'ч'+props.date_only_time.split(':')[1]+'м'} - {props.date_to_only_time.split(':')[0]+'ч'+props.date_to_only_time.split(':')[1]+'м'}</div>
                            </div>
                        </div>
                    </div>
                )
            case 'WeekEventsWithTitle':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventItemTitle'>Задачи за неделю</div>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.StartDate}д - {props.Closedate}д</div>
                            </div>
                        </div>
                    </div>
                )
            case 'WeekEventsHours':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.date_only_time.split(':')[0]+'ч'+props.date_only_time.split(':')[1]+'м'} - {props.date_to_only_time.split(':')[0]+'ч'+props.date_to_only_time.split(':')[1]+'м'}</div>
                            </div>
                        </div>
                    </div>
                )
            case 'WeekEvents':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.StartDate}д - {props.Closedate}д</div>
                            </div>
                        </div>
                    </div>
                )
            case 'MonthEventWithTitleHours':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventItemTitle'>Задачи за {Calendar.Month[props.month-1]}</div>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.date_only_time.split(':')[0]+'ч'+props.date_only_time.split(':')[1]+'м'} - {props.date_to_only_time.split(':')[0]+'ч'+props.date_to_only_time.split(':')[1]+'м'}</div>
                            </div>
                        </div>
                    </div>
                )
            case 'MonthEventsWithTitle':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventItemTitle'>Задачи за {Calendar.Month[props.month-1]}</div>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.StartDate}д - {props.Closedate}д</div>
                            </div>
                        </div>
                    </div>
                )
            case 'MonthEventsHours':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.date_only_time.split(':')[0]+'ч'+props.date_only_time.split(':')[1]+'м'} - {props.date_to_only_time.split(':')[0]+'ч'+props.date_to_only_time.split(':')[1]+'м'}</div>
                            </div>
                        </div>
                    </div>
                )
            case 'MonthEvents':
                return (
                    <div className='HistoryEvents' key={props.items}>
                        <div className='HistoryEventItem'>
                            <div className='EventBody'>
                                <div className='EventColorMark' style={{background: ShowEventsList.EventsList[props.items]['event_color']}}></div>
                                <div className='EventItemBody'>{ShowEventsList.EventsList[props.items]['event_name']}</div>
                                <div className='EventItemTime'>{props.StartDate}д - {props.Closedate}д</div>
                            </div>
                        </div>
                    </div>
                )
        }
    }
}

export default HistoryCurrentDay;
const db = require('./db')

class UserController {
    async getUsers(req, res) {
        try {
            const user_id = req.params.id
            const users = await db.query(`select * from "Users" where user_id = \'${user_id}\'`)
            res.status(200).json(users.rows)
        } catch(e) {
            res.status(400).json(e)
        }
    }
    async updateUser(req, res) {
        try {
            const user_id = req.params.id
            const {surname, name, middlename, organization, email, phone, department, position, login, schedule_id} = req.body
            const users = await db.query(`update "Users" set surname = $1, name = $2, middlename = $3, organization = $4, email = $5, phone = $6, department = $7, position = $8, login = $9, schedule_id = $10 where user_id = \'${user_id}\' returning *`, [surname, name, middlename, organization, email, phone, department, position, login, schedule_id])
            res.status(200).json(users.rows)
        } catch(e) {
            res.status(500).json(e)
        }
        
    }
    async getWorkSchedule(req, res) {
        const scheduleid = req.params.id
        const workSchedule = await db.query('select * from "Schedule" where schedule_id = $1', [scheduleid])
        res.send(workSchedule.rows)
    }
    async getEvents(req, res) {
        try {
            const user_id = req.params.id
            const schedule_id = req.params.schedule_id
            const Events = await db.query(`select * from "Events" where calendar_id = ${schedule_id}`)
            res.status(200).json(Events.rows)
        } catch(e) {
            res.status(400).json(e)
        }
        
    }
    async createNewEvent(req, res) {
        try {
            const {ColorMark, EventInputTitle, EventTextArea, EventDateInput, EventUsersListInput, EventNotificationTime, UserId, calendar_id, EventNotificationActive, EventDateToInput} = req.body
            const Events = await db.query('INSERT INTO "Events" (event_name, event_body, event_date, user_id, event_color, event_notification_time, calendar_id, event_notification_active, event_date_to) values($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *', [EventInputTitle, EventTextArea, EventDateInput, UserId, ColorMark, EventNotificationTime, calendar_id, EventNotificationActive, EventDateToInput])
            res.status(200).json({
                message: Events.rows[0]
            })
        } catch(e) {
            res.status(400).json({
                message: e
            })
        }
    }
    async getInfoAboutEvent(req, res) {
        try {
            const Event_id = req.params.event_id;
            const Event_info = await db.query('select * from "Events" where event_id = $1', [Event_id])    
            res.status(200).json(Event_info.rows)
        } catch(e) {
            res.status(400).json(e)
        }
        
    }
    async updateEventInfo(req, res) {
        try {
            const Event_id = req.params.event_id;
            const {event_color, event_name, event_body, event_date, event_notification_time, event_notification_active, event_date_to} = req.body
            await db.query('update "Events" set event_name = $1, event_body = $2, event_date = $3, event_color = $4, event_notification_time = $5, event_notification_active = $7, event_date_to = $8 where event_id = $6 returning *', [event_name, event_body, event_date, event_color, event_notification_time, Event_id, event_notification_active, event_date_to])    
            res.status(200).json('Update succeded')
        } catch(e) {
            res.status(400).json(e)
        }       
    }
    async deleteEvent(req, res) {
        try {
            const Event_id = req.params.event_id;
            await db.query('delete from "Events" where event_id = $1', [Event_id])    
            res.status(200).json('Delete succeded')
        } catch(e) {
            res.status(400).json(e)
        }  
    }
    async getCalendarList(req, res) {
        try {
            const CalendarList = await db.query('select * from "Calendars"')    
            res.status(200).json(CalendarList.rows)
        } catch(e) {
            res.status(400).json(e)
        }
    }
    async getSubordinates(req, res) {
        try {
            const user_id = req.params.id
            const SubordinatesList = await db.query(`select * from "Users" where manager = \'${user_id}\'`)    
            res.status(200).json(SubordinatesList.rows)
        } catch(e) {
            res.status(400).json(e)
        }
    }
    async createNewCalendar(req, res) {
        try {
            const {CalendarInputName, calendar_type, creator_id} = req.body
            const CreateNewEvent = await db.query(`insert into "Calendars" values (default, \'${CalendarInputName}\', \'${calendar_type}\', \'${creator_id}\')`)    
            res.status(200).json(CreateNewEvent.rows)
        } catch(e) {
            res.status(400).json(e)
        }
    }
    async DeleteCalendarByName(req, res) {
        try {
            const {calendar_name, calendar_type, user_id} = req.body
            const DeleCalendar = await db.query(`delete from "Calendars" where calendar_name = \'${calendar_name}\' and calendar_type = \'${calendar_type}\' returning *`)    
            if (DeleCalendar.rowCount == 0) {
                res.status(409).json('The calendar was not found or you are not its creator')
            } else {
                res.status(200).json(DeleCalendar.rows)
            }
        } catch(e) {
            res.status(400).json(e)
        }
    }
    async getPermissionByRoleId(req, res) {
        try {
            const role_id = req.params.role_id
            const GetPermissions = await db.query(`select * from "Roles" where role_id = ${role_id}`)    
            res.status(200).json(GetPermissions.rows)
        } catch(e) {
            res.status(500).json(e)
        }
    }
}

module.exports = new UserController()
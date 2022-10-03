import { makeAutoObservable } from "mobx"
import EventsBlock from './Events'
import Calendar from "./Calendar"

class UserInfo {

    UserInfo = []
    user_uuid = ''
    SubordinatesList = []
    
    constructor() {
        makeAutoObservable(this)
    }

    SetUserinfo(temp) {
        this.UserInfo = temp
    }

    updateUserCalendarId(new_calendar_id) {

        // Получение списка календарей
        let My = false
        let MySubordinates = false
        let Departments = false

        for (let items = 0; items < Calendar.CalendarList.length; items++) {
          if (Calendar.CalendarList[items]['calendar_type'] === 'My') {
            if (Calendar.CalendarList[items]['calendar_id'] === new_calendar_id) {
              My = true
            }
          }
        }
        for (let items = 0; items < this.SubordinatesList.length; items++) {
          if (this.SubordinatesList[items]['schedule_id'] === new_calendar_id) {
            MySubordinates = true
          }
        }
        for (let items = 0; items < Calendar.CalendarList.length; items++) {
          if (Calendar.CalendarList[items]['calendar_type'] === 'Department') {
            if (Calendar.CalendarList[items]['calendar_id'] === new_calendar_id) {
              Departments = true
            }
          }
        }

        let user_info = this.UserInfo
        user_info['schedule_id'] = new_calendar_id
        if (this.user_uuid === '') {
          fetch('/update-user/' + localStorage.LastUserId, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
            body: JSON.stringify(user_info)
          }).then(function(response) {
            return response.json()
          });
          this.UserInfo = user_info
        } else {
          fetch('/update-user/' + this.user_uuid, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'Content-Length': '<calculated when request is sent>'
            },
            body: JSON.stringify(user_info)
          }).then(function(response) {
            return response.json()
          });
          this.UserInfo = user_info
        }
        
        EventsBlock.SetUpdateScreen()
    }
    // Получить список подчинённых
    async getSubordinatesList() {
      const Subordinates = await fetch('/subordinates/' + localStorage['LastUserId'], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': '<calculated when request is sent>'
        },
      }).then(function(response) {
        return response.json()
      });

      this.SubordinatesList = Subordinates
    }
    // Получить список прав пользователя по id его роли
    async getUserPermissionsByRoleId() {
      const Permissions = await fetch('/permissions-list/' + localStorage['UserRoleId'], {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Content-Length': '<calculated when request is sent>'
        },
      }).then(function(response) {
        return response.json()
      });
      localStorage.setItem('UserPermissions', JSON.stringify(await Permissions[0]))
    }
}

export default new UserInfo()
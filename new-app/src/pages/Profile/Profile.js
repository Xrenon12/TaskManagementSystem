import React, { useState, useEffect } from "react";
import { Link, useParams } from 'react-router-dom'
import UserInfo from "../../mobx/UserInfo";
import './index.css';

// import WorkSchedule from '../WorkSchedule/compact/WorkSchedule';


const UserProfile = () => {

  const params = useParams();
  UserInfo.user_uuid = params.id

  localStorage.setItem('LastUserId', UserInfo.user_uuid);

  const [newParams, setNewParams] = useState({
    surname: '',
    name: '',
    middlename: '',
    organization: '',
    email: '',
    phone: '',
    department: '',
    position: '',
    login: '',
    ScheduleId: ''
  })

  const [users, setUsers] = useState([])

  const [workSchedule, setWorkSchedule] = useState(
    []
  )

  const [workStatus, setWorkStatus] = useState(false)

  useEffect(() => {
    if (UserInfo.user_uuid === '') {
      const fetch1 = fetch('/profile/' + localStorage.LastUserId)
        .then(res => res.json())
        .then(users => {setUsers(users); localStorage.setItem('UserInfo', JSON.stringify(users[0]))});
    } else {
      const fetch1 = fetch('/profile/' + UserInfo.user_uuid)
        .then(res => res.json())
        .then(users => {setUsers(users); localStorage.setItem('UserRoleId', users[0]['role_id']); localStorage.setItem('UserInfo', JSON.stringify(users[0]))});
    }
    // Запись в localStorage прав пользователя
    UserInfo.getUserPermissionsByRoleId()

    // localStorage('UserPermissions', Permissions)
    // console.log(localStorage['UserPermissions'])
    
    const fetch2 = fetch('/workSchedule' + '/' + '1')
      .then(res => res.json())
      .then(workSchedule => setWorkSchedule(workSchedule));

    updateUserStatus() 
  }, [])

  function updateInput(event) {
    let temp = Object.assign({}, newParams);
    temp = Object.assign({}, newParams);
    temp = users[0];
    if (event.target.attributes[1].value === 'CurrentDepartment') {
      temp.department = event.target.value;
    } else {
      temp.position = event.target.value;
    }
    
    setNewParams(temp);
  }

  function uploadNewDate() {

    let temp = users[0]
    console.log(temp)

    fetch('/update-user/' + UserInfo.user_uuid, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': '<calculated when request is sent>'
      },
      body: JSON.stringify(temp)
    }).then(function(response) {
      console.log(response)
      return response.json()
    });
  }

  function updateUserStatus() {
    var date = new Date();
    let LocalworkStatus = date.getDay();
    if (LocalworkStatus === 6 || LocalworkStatus === 0) {
      LocalworkStatus = true
    } else {
      LocalworkStatus = false
    }
    
    setWorkStatus(LocalworkStatus)
  }
      
      return (
        <div className="Frame">
          {users.map((user, index) => {
            return (
              <div className="Profile" key={"profile" + index}>
                <div className="UserProfile">
                  <a className="ApproveButton" onClick={() => {uploadNewDate()}}></a>
                  <div className="UserIcon">
                    <div className="Icon" style={{'background': `url(${JSON.parse(localStorage['UserInfo']).icon}) 50% 50%`, 'backgroundSize': 'cover'}}></div>
                  </div>
                  <div className="UserInfo">
                    <div className="UserFIO">
                      <div id="Surname" className="Surname">{user.surname}</div>
                      <div className="Name">{user.name}</div>
                      <div className="MiddleName">{user.middlename}</div>
                    </div>
                    <p className="UserOrganization"></p>
                  </div>
                  <div className="UserStatus">
                    {workStatus?(
                      <>
                        <span className="OutputStatus"></span>
                        <h2 className="Status Status-output">Выходной</h2>
                      </> 
                    ):(
                      <>
                        <span className="WorkStatus"></span>
                        <h2 className="Status Status-working">Рабочий</h2>
                      </>
                    )}
                  </div>
                  <div className="UserContacts">
                    <div className="Contacts">
                      <a href="mailto:ivan32@mail.ru">{user.email}</a>
                      <a href="tel:89124566734">{user.phone}</a>
                    </div>
                  </div>
                </div>
                <div className="OrganizationInfo">
                  <div className="UserDepartment">
                    <div className="Department">Отдел</div>
                    <input id="Department" className="CurrentDepartment" defaultValue={user.department} onChange={(event) => {updateInput(event)}}></input>
                  </div>
                  <div className="UserPosition">
                    <div className="Position">Должность</div>
                    <input id="Position" className="CurrentPosition" defaultValue={user.position} onChange={(event) => {updateInput(event)}}></input>
                  </div>
                </div>
                <div className="WorkSchedule">
                  <div className="Schedule">
                    <Link to="/fullsize-work-schedule">График работы</Link>
                    <div className="WorkTime">
                      <div className="LeftColumn">
                        <div>Понедельник</div>
                        <div>Вторник</div>
                        <div>Среда</div>
                        <div>Четверг</div>
                        <div>Пятница</div>
                        <div className="output_day">Суббота</div>
                        <div className="output_day">Воскресенье</div>
                      </div>
                      {workSchedule.map((workSchedule, index) => {
                        return (
                          <div className="RightColumn" key={"profile" + index}>
                            <div>{workSchedule.monday}</div>
                            <div>{workSchedule.tuesday}</div>
                            <div>{workSchedule.wednesday}</div>
                            <div>{workSchedule.thursday}</div>
                            <div>{workSchedule.friday}</div>
                            <div className="output">{workSchedule.saturday}</div>
                            <div className="output">{workSchedule.sunday}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
                <div className="UserLogin">
                  <div className="Login">
                    <p>Логин</p>
                    <p>{user.login}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      );
}

export default UserProfile;
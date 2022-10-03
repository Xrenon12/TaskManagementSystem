const Router = require('express')
const router = new Router()
const userController = require('./user.controller')

// Получить собственный профиль
router.get('/profile/:id', userController.getUsers)
// Обновить данные пользователя
router.put('/update-user/:id', userController.updateUser)
// Получить график работ по id
router.get('/workSchedule/:id', userController.getWorkSchedule)
// Получить список событий пользователя по его id
router.get('/events/:id&:schedule_id', userController.getEvents)
// Создать новое событие
router.post('/create-event', userController.createNewEvent)
// Получить информацию о событии по запросу
router.get('/event/:event_id', userController.getInfoAboutEvent)
// Обновить информацию о событии
router.put('/event-update/:event_id', userController.updateEventInfo)
// Удалить событие
router.delete('/delete-event/:event_id', userController.deleteEvent)
// Получить список календарей
router.get('/calendar-list', userController.getCalendarList)
// Получить список подчинённых
router.get('/subordinates/:id', userController.getSubordinates)
// Создать новый календарь
router.post('/create-calendar', userController.createNewCalendar)
// Удалить календарь по его названию и типу
router.delete('/delete-calendar', userController.DeleteCalendarByName)
// Получить права пользователя
router.get('/permissions-list/:role_id', userController.getPermissionByRoleId)


module.exports = router

const express = require('express')
const cors = require('cors');
const userRouter = require('./user.routes')

const PORT = process.env.PORT || 3001

const app = express()

app.use(express.json())
app.use(cors());
app.use('/', userRouter)

app.listen(PORT, () => console.log(`server start on port ${PORT}`))
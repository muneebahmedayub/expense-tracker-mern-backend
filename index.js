const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()

const PORT = process.env.PORT || 5000
const app = express();

app.use(express.json())

app.use(cors())

mongoose.connect(process.env.URI, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }, () => {
    console.log('connected to DB!')
})

//Import Routes
const transactionsRouter = require('./routes/transactions')
const authRouter = require('./routes/auth');
const auth = require('./middleware/auth');

app.use('/transactions', auth, transactionsRouter)
app.use('/auth', authRouter)


app.listen(PORT, () => console.log('server started on port ' + PORT))

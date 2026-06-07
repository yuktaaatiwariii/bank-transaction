const express = require('express');
const app = express();

const cookieParser = require('cookie-parser');
app.use(cookieParser());


const authRouter = require ('./routes/auth.routes');
const accountRouter = require('./routes/account.routes');




app.use('/api/accounts', accountRouter);

app.use(express.json());
app.use('/api/auth', authRouter);

module.exports = app;




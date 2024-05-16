const express = require('express');
const cors  = require('cors');
const {APP_PORT,DB_URL} = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const app = express();
const routes = require('./routes/routes');
const mongoose = require('mongoose');

mongoose.connect(DB_URL, {
});
const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('Success: MongoDB connection established');
});

app.use(cors());
app.use(express.json());
app.use('/api',routes);
app.use(errorHandler);
app.listen(APP_PORT, () => {
    console.log(`App is running on port ${APP_PORT}`);
});

// db().catch(error => console.error(error));
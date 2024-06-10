const express = require('express');
const passport = require("passport");
const cors  = require('cors');
const {APP_PORT,DB_URL} = require('./config');
const errorHandler = require('./middlewares/errorHandler');
const bodyParser = require('body-parser');
const app = express();
const authRoutes = require('./routes/authRoutes');
const routes = require('./routes/routes');
const mongoose = require('mongoose');
const {auth} = require('./middlewares/passportAuth');


const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('Success: MongoDB connection established');
});
auth();
app.use(passport.initialize());

mongoose.connect(DB_URL, {
    // useNewUrlParser: true, 
    useUnifiedTopology: true,
    useNewUrlParser: true,    
});

app.get('/', async (req, resp) => {
    resp.send({message: 'welcome to MongoDB Project'});
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/api', passport.authenticate("jwt",{session:false}));
app.use('/api',routes);
app.use('/auth',authRoutes);
app.use('/uploads',express.static('uploads'));
app.use(errorHandler);

app.listen(APP_PORT, () => {
    console.log(`App is running on port ${APP_PORT}`);
});

// db().catch(error => console.error(error));
import mongoose from 'mongoose';

mongoose.connect('mongodb://127.0.0.1:27017/ecom', {
    // userNewUrlParser: true,
    // useFindAndModify: false,
    // useUnifiedTopology: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
    // poolSize: 10,
    // session:[1,2]
});
const db = mongoose.connection;
db.on('error', console.error.bind(console,'connection error:'));
db.once('open', () => {
    console.log('MongoDB Connected...');
});
require('dotenv').config();

const app = require('express')();
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

// apply plugins
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

// connect to dbs: mongoose, mongo
require('./db/connect');

// add routes
app.use('/api/game-submission', require('./router'));

// create post, to change this create .env file and add PORT=#
const PORT = process.env.PORT || 8000;

// start the server
app.listen(PORT, () => {
    console.log(`-> Server is up and running on port ${PORT}`);
    if (process.env.NODE_ENV === 'development') {
        console.log(`-> Go to server: http://localhost:${PORT}/api/game-submission`);
    }
    console.log(`-> Environment: ${process.env.NODE_ENV}`);
});

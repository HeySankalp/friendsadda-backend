const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const userRoute = require('./routes/users');
const authRoute = require('./routes/auth');
const postRoute = require('./routes/posts');
const cors = require('cors')
const fs = require('fs');
const multer = require('multer');
const path = require('path');
const app = express();
app.use(cors());
app.use(helmet());



const port = process.env.PORT || 8000;

//------------Mongodb connection to database-------------
dotenv.config();
mongoose.connect(process.env.mongoURI,{ useNewUrlParser: true, useUnifiedTopology: true })
        .then( () => {
            console.log('Connected to database ✔️')
        })
        .catch( (err) => {
            console.error(`Error connecting to the database. \n${err}❌`);
        })
   

//-------------------middleware----------------------
app.use(express.json());
app.use(morgan("common"));

//-------------------API--------------------------
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(port, () => {
    console.log(`backend running on port:${port}🔥`);
})


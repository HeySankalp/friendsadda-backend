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


        // app.use(function(req, res, next) {
        //     res.header("Access-Control-Allow-Origin", "https://friendsadda-clone.web.app");
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     next();
        //   });       

        

//-------------------middleware----------------------
app.use(express.json());
app.use(morgan("common"));

//--------link to get images from server-------------
app.use("/images", express.static(path.join(__dirname,"public/images")));

//------Defining storage where to store and how to store---------POST
const poststorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "public/images/post");
    },
    filename: (req, file, cb)=>{
        cb(null, req.body.name);
    }
});
//------Defining storage where to store and how to store---------USER
const userstorage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, "public/images/person");
    },
    filename: (req, file, cb)=>{
        cb(null, req.body.name);
    }
});


const upload = multer({storage: poststorage});
const uploadDp = multer({storage: userstorage});

//----------------post req to store a file onto the server------------------
app.post("/api/upload", upload.single("file"), (req,res)=>{
    try {
        return res.status(200).json("file uploaded successfully!");
    } catch (error) {
        console.error(error);
    }
});

//----------------post req to store a file onto the server and delte the previoua one------------------
app.post("/api/uploadprofile/:profilepic", uploadDp.single("file"), (req,res)=>{
    try {
        if (req.params.profilepic) {
            const filepath = `./public/images/person/${req.params.profilepic}`;
            fs.unlink(filepath, callback);
            function callback(error) {
                if(error){
                    console.log(error);
                }else
                console.log("old profile pic deleted");
            }
        }
        return res.status(200).json("profilepicture updated");
    } catch (error) {
        console.error(error);
    }
})

// --------------------deleting user user dp from server---------------------------




//-------------------API--------------------------
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/post", postRoute);

app.listen(port, () => {
    console.log(`backend running on port:${port}🔥`);
})


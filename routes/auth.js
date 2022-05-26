const router = require("express").Router();
const User = require("../models/User");
var cors = require('cors');
const bcrypt = require('bcryptjs')

router.use(cors());
let success = true;
//-----------------------USER REGISTRATION------------------------
router.post("/register", async (req, res) => {

    try {
        //------generated the hash of password-----
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt)
        let checkUserEmail = await User.findOne({ email: req.body.email })
        let checkUserUsername = await User.findOne({username : req.body.username})

        if (checkUserEmail||checkUserUsername) {
            success = false;
            return res.status(200).json({ "success": success, "error": "user already exist" });
        } else {
            const newUser = new User({
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword,
            });
            //-----save user and return response-----
            const user = await newUser.save();
            success = true;
            return res.status(200).json({user,"success":success})
        }
    } catch (err) {
        console.log(err);
    }
});

//---------------------------USER LOGIN----------------------------
router.post("/login", async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            success = false;
            return res.status(200).json({ "success": success, "error": "please try again with with correct details" })
        }

        const validPassword = await bcrypt.compare(req.body.password, user.password)
        if (!validPassword) {
            success = false;
            return res.status(200).json({ "success": success, "error": "please try again with with correct details" })
        } else {
            success = true;
            return res.status(200).json({user,"success":success})
        }
    } catch (err) {
        return res.status(500).send(err)
    }
})

module.exports = router
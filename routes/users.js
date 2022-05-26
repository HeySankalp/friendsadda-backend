const router = require("express").Router();
const User = require("../models/User");
var cors = require('cors');
const bcrypt = require('bcryptjs');

router.use(cors());

//-------------------------------------UPDATE USER----------------------------------------
router.put("/:id", async (req, res) => {
    if (req.body._id === req.params.id || req.body.isAdmin) {

        //------------if password in body hash password--------------
        if (req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt)
            } catch (err) {
                return res.status(500).json("can't");
            }
        }

        //------------updating the creds-----------
        try {
            const user = await User.findByIdAndUpdate(req.params.id, { $set: req.body, });
            return res.status(200).json({ "Account updated": user });
        } catch (err) {
            return res.status(500).send(err);
        }

    } else {
        res.status(403).json("you can update only your acccount");
    }
})


//-----------------------------------DELETE USER------------------------------------
router.delete("/:id", async (req, res) => {
    if (req.body._id === req.params.id || req.body.isAdmin) {
        try {
            const user = await User.findByIdAndDelete(req.params.id);
            return res.status(200).json("Account has beed deleted");
        } catch (err) {
            return res.status(500).send(err);
        }

    } else {
        res.status(403).json("you can delete only your acccount");
    }
})


//----------------------------------GET A USER--------------------------------------
router.get("/", async (req, res) => {
    const user_id = req.query.user_id;
    const username = req.query.username;
    try {
        const user = user_id ? await User.findById(user_id).select("-password").select("-updatedAt")
            : await User.findOne({ username: username }).select("-password").select("-updatedAt");
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json(err);
    }
})

// -----------------to check whether the user is available or not-------------------
router.get("/checkuser/:username", async (req, res) => {
    let success = true;
    const username = req.params.username;
    try {
       const user = await User.findOne({ username: username }).select("-password").select("-updatedAt");
        if(user){
            res.status(200).json({"success": success})
        }else{
            success = false;
            res.status(200).json({"success": success})
        }
    } catch (err) {
        res.status(500).json(err);
    }
})


//----------------------------------GET FRIENDS-------------------------------------
router.get("/friends/:id", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.id);
        const friends = await Promise.all(
            currentUser.followings.map((friendId) => {
                return User.findById(friendId);
            })
        );

        let friendList = [];
        friends.map((friend)=>{
            const {_id, username, profilePicture} = friend;
            friendList.push({_id, username, profilePicture});
        });
        res.status(200).json(friendList);
    } catch (error) {
        res.status(500).json(error)
        console.error(error);
    }
})


//---------------------------------FOLLOW USER--------------------------------------
router.put("/:id/follow", async (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body._id);
            if (!user.followers.includes(currentUser._id)) {
                await user.updateOne({ $push: { followers: currentUser._id } });
                await currentUser.updateOne({ $push: { followings: user._id } });
                res.status(200).json("user has been followed");
            } else {
                res.status(403).json("you already following this user")
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you can't follow yourself");
    }
})


//------------------------------UNFOLLOW USER------------------------------------
router.put("/:id/unfollow", async (req, res) => {
    if (req.body._id !== req.params.id) {
        try {
            const user = await User.findById(req.params.id);
            const currentUser = await User.findById(req.body._id);
            if (user.followers.includes(currentUser._id)) {
                await user.updateOne({ $pull: { followers: currentUser._id } });
                await currentUser.updateOne({ $pull: { followings: user._id } });
                res.status(200).json("user has been unfollowed");
            } else {
                res.status(403).json("you are already not following thjs user");
            }
        } catch (err) {
            res.status(500).json(err);
        }
    } else {
        res.status(403).json("you can't unfollow yourself");
    }
})
module.exports = router
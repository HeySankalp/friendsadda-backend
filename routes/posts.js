const router = require('express').Router();
const Post = require('../models/Post');
var cors = require('cors');
const User = require('../models/User');
const fs = require('fs');

router.use(cors());

//--------------------------Create a post------------------------------------
router.post("/create", async (req, res) => {
    const newPost = new Post(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
        console.error(err);
    }
});


//-----------------------------update a post----------------------------------
router.put("/:id", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        //--------------check whether the owner of post----------------------
        if (post.user_id === req.body._id) {
            await post.updateOne({ $set: req.body });
            res.status(200).json("post updated");
        } else {
            res.status(403).json("you can update only your post");
        }
    } catch (err) {
        res.status(500).json(err);
    }
});

//------------------------------delete a post-----------------------------------
router.delete("/:id/:postowner", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (post.user_id === req.params.postowner) {
            await post.deleteOne();
            res.status(200).json("post deelted successfully");
        } else {
            res.status(403).json("you can delete only your post");
        }
    } catch (err) {
        console.error(err);
        res.status(500).json(err);
    }
})
//--------------------------------like a post------------------------------------
router.put("/:id/like", async (req, res) => {
    const post = await Post.findById(req.params.id);
    try {
        if (!post.likes.includes(req.body._id)) {
            await post.updateOne({ $push: { likes: req.body._id } });
            res.status(200).send(true);
        } else {
            await post.updateOne({ $pull: { likes: req.body._id } });
            res.status(200).json(false);
        }
    } catch (err) {
        res.status(403).json("err");
    }
})

//-------------------------------get a post----------------------------------------
router.get("/:id", async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json("err");
    }
})

//-------------------get timelines posts (of following user)-----------------------
router.get("/timeline/post:id", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.id);
        const userPosts = await Post.find({ user_id: currentUser._id });
        const friendposts = await Promise.all(
            currentUser.followings.map((friendId) => {
                return Post.find({ user_id: friendId });
            })
        );
        res.status(200).json(userPosts.concat(...friendposts));
    } catch (err) {
        res.status(500).json("err");
    }
})



//-------------------get timelines posts (of current user)-----------------------
router.get("/profile/:username", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        const post = await Post.find({ user_id: user._id });
        res.status(200).json(post);
    } catch (err) {
        res.status(500).json("err");
    }
})




module.exports = router;
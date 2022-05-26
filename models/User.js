const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        min: 3,
        max: 20,
    },
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        require: true,
        min: 5,
    },
    profilePicture: {
        type: String,
        default: ""
    },
    coverPicture: {
        type: String,
        default: "",
    },
    description: {
        type: String,
        max: 50,
        default: "welcome to my profile!"
    },
    city: {
        type: String,
        max: 50,
        default: "My city"
    },
    from: {
        type: String,
        max: 50,
        default: "My country"
    },
    relationship: {
        type: Number,
        default: 1,
        enum: [1, 2, 3],
    },
    followers: {
        type: Array,
        default: [],
    },
    followings: {
        type: Array,
        default: [],
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
},
    { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
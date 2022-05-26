const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    user_id: {
        type: String,
        required: true
    },
    description: {
        type: String,
        max: 500
    },
    image: {
        type: String,
        default:""
    },
    likes: {
        type: Array,
        default: []
    }

},
    { timestamps: true }
)

module.exports = mongoose.model("Post",PostSchema);
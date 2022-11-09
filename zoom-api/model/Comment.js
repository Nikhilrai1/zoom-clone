const { default: mongoose } = require("mongoose");



const commentSchema = mongoose.Schema({
    username: {type: String,require: true},
    comment: {type: String,require: true}
},{timestamps: true})

const Comment = mongoose.model("Comment",commentSchema);
module.exports = Comment
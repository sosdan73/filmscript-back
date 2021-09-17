const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    courseId: { type: String },
    number: { type: Number },
    name: { type: String },
    presentation: { type: Array }
})

module.exports = mongoose.model('Class', schema)
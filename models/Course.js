const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    name: { type: String },
    teacher: { type: String },
})

module.exports = mongoose.model('Course', schema)
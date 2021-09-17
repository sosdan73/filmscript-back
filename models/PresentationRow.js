const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    classId: { type: String },
    slide: { type: Number },
    scene: { type: String },
    source: { type: String },
    transition: { type: String },
    overlay1: { type: String },
    overlay2: { type: String },
    overlay3: { type: String },
    overlay4: { type: String },
    text: { type: String }
})

module.exports = mongoose.model('PresentationRow', schema)
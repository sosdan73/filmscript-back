const mongoose = require('mongoose')

const schema = new mongoose.Schema({
    server: { type: String },
    user: { type: String },
    password: { type: String },
    port: { type: String },
    sslPort: { type: String },
    websocketsPort: { type: String }
})

module.exports = mongoose.model('Mqtt', schema)
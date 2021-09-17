const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const { objectId } = require('mongoose');
const { json } = require("body-parser");
app.use(bodyParser.json());
const jsonParser = bodyParser.json();
const Mqtt = require('./models/Mqtt.js');
const Course = require('./models/Course.js');
const Class = require('./models/Class.js');

// OBS
const OBSWebSocket = require('obs-websocket-js');
const obs = new OBSWebSocket();

// vMix
const { XmlApi: vMixXmlApi } = require('vmix-js-utils');
const { DataParser, GeneralState } = require('vmix-js-utils');


const mongoDB = 'mongodb+srv://sosdan73:1234@testbase.flj56.mongodb.net/Courses?retryWrites=true&w=majority';
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*"); 
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
});

// Courses

app.get('/get-courses', jsonParser, async (req, res) => {
    body = req.body;
    await Course.find({})
    .then(data =>{
        res.status(200);
        res.send(data);
        console.log('courses are sent');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.post('/post-course', jsonParser, async (req, res) => {
    body = req.body;
    await Course.create({
        name: body.name,
        teacher: body.teacher
    })
    .then(()=>{
        res.status(200);
        console.log('Курс создан');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

// Classes

app.post('/get-classes', jsonParser, async (req, res) => {
    body = req.body;
    await Class.find({ courseId: body.courseId })
    .then(data =>{
        res.status(200);
        res.send(data);
        console.log('Classes are sent');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.post('/create-class', jsonParser, async (req, res) => {
    body = req.body;
    await Class.create({
        courseId: body.courseId,
        number: body.number,
        name: body.name,
        presentation: []
    })
    .then(data => {
        res.status(200);
        res.send(data)
        console.log('Class created');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.post('/update-presentation', jsonParser, async (req, res) => {
    body = req.body;
    await Class.findOneAndUpdate(
        { _id: body.id },
        { presentation: body.presentation }
    )
    .then(()=>{
        res.status(200);
        console.log('Class changed');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

// MQTT

app.post('/post-mqtt', jsonParser, async (req, res) => {
    body = req.body;
    await Mqtt.create({
        server: body.server,
        user: body.user,
        password: body.password,
        port: body.port,
        sslPort: body.sslPort,
        websocketsPort: body.websocketsPort,
    })
    .then(()=>{
        res.status(200);
        console.log('saved');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.post('/count', jsonParser, async (req, res) => {
    body = req.body;
    await Course.countDocuments()
    .then(data => {
        res.status(200);
        console.log(data);
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.post('/put-mqtt', jsonParser, async (req, res) => {
    body = req.body;
    await Mqtt.findOneAndUpdate(
        { "id": 0 },
        {
            server: body.server,
            user: body.user,
            password: body.password,
            port: body.port,
            sslPort: body.sslPort,
            websocketsPort: body.websocketsPort
        }
    ).then(()=>{
        res.status(200);
        console.log('Изменения сохранены');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.get('/get-mqtt', jsonParser, async (req, res) => {
    body = req.body;
    await Mqtt.find({})
    .then(data =>{
        res.status(200);
        res.send(data);
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

// OBS
app.post('/connect-obs', jsonParser, async (req, res) => {
    body = req.body;
    obs.connect({
        address: `${body.address}:${body.port}`,
        password: body.password
    })
    .then(data => {
        res.status(200);
        res.send(data)
        console.log('OBS подключен');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.post('/disconnect-obs', jsonParser, async (req, res) => {
    body = req.body;
    obs.disconnect()
    .then(data => {
        res.status(200);
        res.send(data)
        console.log('OBS отключен');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

app.post('/get-obs-data', jsonParser, async (req, res) => {
    body = req.body;
    obs.send('GetSceneList')
    .then(data => {
        res.status(200);
        res.send(data)
        console.log('Данные отправлены');
    })
    .catch(err => {
        res.status(500);
        console.error(err)
    })
})

// vMix

app.post('/get-vmix-data', jsonParser, async (req, res) => {
    body = req.body;
    let data = `
        <inputs>
        <input key="2f1a752b-6fc7-444f-9822-535e429ddcb1" number="1" type="NDI" title="NDI TEACHER (Intel(R) UHD Graphics 1)" shortTitle="NDI TEACHER (Intel(R) UHD Graphics 1)" state="Running" position="0" duration="0" loop="False" muted="False" volume="100" balance="0" solo="False" audiobusses="M" meterF1="0" meterF2="0">NDI TEACHER (Intel(R) UHD Graphics 1)</input>
        <input key="126b6232-eeb8-49c0-9e35-98ac3b9fcdb9" number="2" type="VLC" title="VLC rtsp://172.18.191.57:554/stream/main" shortTitle="VLC rtsp://172.18.191.57:554/stream/main" state="Running" position="0" duration="0" loop="False" muted="False" volume="100" balance="0" solo="False" audiobusses="M" meterF1="0" meterF2="0">VLC rtsp://172.18.191.57:554/stream/main</input>
        <input key="495a26c9-48b7-4d94-bf56-11b9b57b591d" number="3" type="Colour" title="Colour" shortTitle="Colour" state="Paused" position="0" duration="0" loop="False">
        Colour
        <overlay index="0" key="2f1a752b-6fc7-444f-9822-535e429ddcb1"/>
        <overlay index="2" key="126b6232-eeb8-49c0-9e35-98ac3b9fcdb9">
        <position panX="0.798" panY="0.493" zoomX="0.37875" zoomY="0.37875"/>
        </overlay>
        </input>
        <input key="785f7014-6cbf-40e3-b3c7-127d2b327d51" number="4" type="Colour" title="Colour" shortTitle="Colour" state="Paused" position="0" duration="0" loop="False">
        Colour
        <overlay index="0" key="2f1a752b-6fc7-444f-9822-535e429ddcb1"/>
        <overlay index="1" key="126b6232-eeb8-49c0-9e35-98ac3b9fcdb9"/>
        </input>
        </inputs>
    `;
    const xmlDocument = vMixXmlApi.DataParser.parse(data);
    const xmlInputs = vMixXmlApi.Inputs.extractInputsFromXML(xmlDocument);
    const inputs = vMixXmlApi.Inputs.map(xmlInputs);
    const titles = inputs.map(input => input.title)
    console.log(xmlInputs);
    res.send(xmlInputs)
    // .then(data => {
    //     res.status(200);
    //     res.send(data)
    //     console.log('Данные отправлены');
    // })
    // .catch(err => {
    //     res.status(500);
    //     console.error(err)
    // })
})

// General

app.listen(8081)
console.log('Works!');


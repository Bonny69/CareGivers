const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('strictQuery', false);
const app = express()
const port = process.env.port || 5002;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
const { Memo } = require('./schedule.js')
const { terapia } = require('./therapy.js')
const {caregivers_patient} = require('../otp/caregivers_associated_patients')

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectToMongoDB() {
  try {
    await client.connect();
    
    console.log("connected to MongoDB!");
    return client; 
  } catch (error) {
    console.log("Failed to connect to MongoDB:", error);
    throw error;
  }
}

 connectToMongoDB().then(()=>{
  app.listen(port,(err) => {
    if(err)
        console.log(err);
    console.log('server running on port ' + port);
  })
})


  app.post('/insertMemo', async (req,res) => {
    try {
        const dataMemo = new Date(req.body.data)
        
        const [hoursString, minutesString] = req.body.orario.split(":");
        const selectedTime = {
          hours: parseInt(hoursString, 10),
          minutes: parseInt(minutesString, 10),
        };
        const selectedDate = new Date(dataMemo.getFullYear(), dataMemo.getMonth(), dataMemo.getDate(), selectedTime.hours, selectedTime.minutes);
        const timeDiffInSeconds = Math.floor((selectedDate.getTime() - new Date()) / 1000);
        
        const schedule = new Memo({
          paziente: req.body.email_paziente,                      
          evento: req.body.evento,
          data: req.body.data,
          orario: req.body.orario,
          createdAt: new Date(),
          expires: timeDiffInSeconds
        })

        const db = client.db('schedule')
        const collection = db.collection('schedules')
        await collection.insertOne(schedule)
        return res.status(200).json({
          message: 'inserimento promemoria avvenuto con successo'
        })
    }catch (error) {
        console.log(error)
        return res.status(400).json({
          message: 'errore'
        })
    }
  })


  app.get('/getMemos', async (req,res) => {
    console.log(req.query.email)
    try {
      const db = client.db('schedule')
      const collection = db.collection('schedules')
      const documents = await collection.find({paziente: req.query.email}).toArray();
      console.log(documents)
      res.json(documents)
    } catch (error) {
      console.log(err);
          res.status(500).json({ message: 'Internal server error' });
          return;
    }
  })


  app.post('/insertTherapy', async(req,res) => {
    try {
      const farmaci = new terapia({
        farmaco: req.body.farmaco,
        orario: req.body.orario,
        dosaggio: req.body.dosaggio,
        paziente: req.body.email_paziente
      })
      const db = client.db('schedule')
      const collection = db.collection('therapy')

      await collection.insertOne(farmaci)

      return res.status(200).json({
        message: 'farmaco inserito correttamente'
      })
    } catch (error) {
      console.log(error)
      return res.status(500).json({message: 'errore'})
    }
  })


  app.get('/getTherapy', async (req,res) => {
    console.log('DENTRO GET-Therapy SERVER')
    console.log(req.query.email)

    try { 
      const db = client.db('schedule')
      const collection = db.collection('therapy')
      const documents = await collection.find({paziente: req.query.email}).toArray();
      console.log(documents)
      res.json(documents)
    } catch (error) {
      console.log(err);
          res.status(500).json({ message: 'Internal server error' });
          return;
    }
  })


  app.post('/deleteTask', async (req,res) => {
    console.log(req.body.email)

    try {
      const db = client.db('schedule')
      const collection = db.collection('schedules')
      const result = await collection.deleteOne({paziente: req.body.email, evento: req.body.evento})
      console.log(result)
      return res.status(200).json({message: 'evento cancellato correttamente'})
    } catch (error) {
      console.log(err);
          res.status(500).json({ message: 'Internal server error' });
          return;
    }
  })


  app.post('/deleteDrug', async (req,res) => {
    console.log(req.body.email)

    try {
      const db = client.db('schedule')
      const collection = db.collection('therapy')
      const result = await collection.deleteOne({paziente: req.body.email, farmaco: req.body.farmaco})
      console.log(result)
      return res.status(200).json({message: 'farmaco cancellato correttamente'})
    } catch (error) {
      console.log(err);
          res.status(500).json({ message: 'Internal server error' });
          return;
    }
  })

  app.post('/getEmailPatient', async(req,res)=>{
    console.log('dentro get email paziente server')
    console.log(req.body.email)
    try {
      const result = await caregivers_patient.findOne({caregiver: req.body.email})
      if(result)
          res.status(200).json(result)

    } catch (error) {
      console.log(error)
    }
  })
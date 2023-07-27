const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('strictQuery', false);


const app = express()
const port = process.env.port || 5005;
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());

const {connectToAlertsCollection} = require('../auth/db')
const {parameters} = require('./parameters.js')
const {alerts} = require('./alerts.js')

connectToAlertsCollection().then(() => {
  app.listen(port,(err) => {
    if(err)
        console.log(err);
    console.log('server running on port ' + port);
})
})

    app.get('/getData', async (req,res) => {
      const field = req.query.field
      const field2 = req.query.field2
      try {
       const collection = mongoose.connection.db.collection('dataset')

        if(req.query.field === 'HR'){
        const minValue = 50;
        const maxValue = 140;
        const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
        const document = await collection.findOne({[field]: {$gt: randomValue}});
        res.json(document)
        }
        else{
          if(req.query.field === 'SpO2'){
            const minValue = 85;
            const maxValue = 99;
            const randomValue = Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
            console.log(randomValue)
            const document = await collection.findOne({[field]: {$gt: randomValue}});
            res.json(document)
          }else{
            const minValueSystolic = 90
            const maxValueSystolic = 145
            const minValueDyastolic = 40
            const maxValueDyastolic = 95
            const randomValueSystolic = Math.floor(Math.random() * (maxValueSystolic - minValueSystolic + 1)) + minValueSystolic;
            const randomValueDyastolic = Math.floor(Math.random() * (maxValueDyastolic - minValueDyastolic + 1)) + minValueDyastolic;
            const document = await collection.findOne({$and:[
              {[field]: {$gt: randomValueSystolic}},
              {[field2] : {$gt: randomValueDyastolic}}
            ]});
            res.json(document)
          }
        }
      } catch (error) {
        console.log(error)
        return res.status(500)
      }
    })

    app.post('/getAlerts', async(req,res) => {
      console.log(req.body)
      try {
        const result = await alerts.findOne({patient: req.body.email})
        console.log(result)
        if(result){
          res.status(200).json(result)
        }else{
          res.status(400).json()
        }
      } catch (error) {
        console.log(error)
      }
    })

    app.post('/insertAlerts', async(req,res) => {
      try{
        const alert = new alerts({
         patient: req.body.email,
          fc : req.body.fc,
          spO2: req.body.spO2,
          systolic: req.body.systolic,
          diastolic: req.body.diastolic
      })
      const response = await alert.save()
      console.log(response)

      res.status(200).json({message: 'alert inseriti correttamente'})
    }catch(error){
      console.log(error)
      res.status(500).json({message: 'alert già inserito'})
    }
  })


  app.post('/insertPv', async (req,res) => {
    console.log(req.body)
    try {
      const collezione= req.body.collection

      const collection = mongoose.connection.db.collection(collezione)
    
      const parameter = new parameters({
         fc : req.body.fc,
         spO2: req.body.spO2,
         systolic: req.body.systolic,
         diastolic: req.body.diastolic
     })

     collection.insertOne(parameter)
     res.status(200).json({message: 'parametri inseriti'})
    } catch (error) {
      console.log(error)
    }
  }),


  app.post('/getLastValue', async (req,res) => {
    console.log(req.body)
    try {
      const collection = mongoose.connection.db.collection(req.body.collection)
      const result = await collection.findOne({}, { sort: { _id: -1 } })
      res.json(result)
    } catch (error) {
      console.log(error)
      res.status(500)
    }
  })


  app.post('/getMedia', async (req,res) => {
    console.log(req.body)

    const firstDate = new Date(req.body.firstDate + 'T00:00:00.000Z');
    const secondDate = new Date(req.body.secondDate + 'T23:59:59.999Z');

    try {
      const collection = mongoose.connection.db.collection(req.body.collection)

      const result = await collection.aggregate([
        {
          $match: {
            timestamp: {
              $gte: firstDate,
              $lte: secondDate
            }
          }
        },
        {
          $addFields: {
            convertedField: {
              $toInt: '$' + req.body.parametro
            }
          }
        },
        {
          $group: {
            _id: null,
            averageField: { $avg: '$convertedField' }
          }
        }
      ]).toArray();
      
      console.log(result)
      res.json(result)
    } catch (error) {
      res.status(500).json({ error: 'An error occurred' });
      console.log(error)
    }
  })
const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/?retryWrites=true&w=majority';
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
mongoose.set('strictQuery', false);
const router = require('express').Router();


const app = express()
const port = process.env.port || 5001;
app.use(express.json());
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


const database = async () => {
    try {
       await mongoose.connect('mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/associazioni?retryWrites=true&w=majority')
      console.log('DB connected')
    } catch (error) {
      console.log(error)
    }
  }
  database();

  app.post('/insertOtp', async (req,res) =>{
    console.log('DENTRO INSERT OTP SERVER')
    database();
  
    try{
      console.log(req.body.otp)
      console.log(req.body.email)
      const { otp } = require('./otp.js');
      
      const Otp = new otp({
        email: req.body.email,
        otp: req.body.otp
      })

      const response = await Otp.save()
      console.log(response)

      res.status(200).json({message: 'otp generato correttamente'})
      }catch(error){
        console.log(error)
        res.status(404).json("User not found");
    }
  })


  app.post('/checkOtp', async (req,res) => {
    console.log('DENTRO CHECK OTP SERVER')
    database();
    const { otp } = require('./otp.js');
    const { patient_caregivers } = require('./patient_associated_caregivers.js');
    const { caregivers_patient } = require('./caregivers_associated_patients.js');

    try {
      console.log(req.body.otp)
      console.log(req.body.email_paziente)
      console.log(req.body.email_caregiver)

      const match = await otp.findOne({email:req.body.email_paziente, otp: req.body.otp})
      console.log(match)
      if(match!=null){
        const associazione_paziente= new patient_caregivers({
          email: req.body.email_paziente,
          caregivers:{caregiver1: req.body.email_caregiver}
        })
        await associazione_paziente.save()

        const associazione_caregiver = new caregivers_patient({
          caregiver: req.body.email_caregiver,
          patient: req.body.email_paziente
        })
        await associazione_caregiver.save()

        return res.status(200).json({
          message: 'otp confermato'
        })}
      else
        return res.status(400).json({
          message: 'errore'
        })
    } catch (error) {
      console.log(error)
    }
  })

  app.post('/home',  async (req, res) => {
    console.log('dentro home server');
    const { caregivers_patient } = require('./caregivers_associated_patients.js');
    console.log(caregivers_patient)
  
    try {
      const result = await caregivers_patient.find({caregiver: req.body.email_caregiver});
      return res.json(result);
    } catch (err) {
      console.log(err);
      return res.status(500).json({ error: 'An error occurred' });
    }
  });

app.listen(port,(err) => {
    if(err)
        console.log(err);
 
    console.log('server running on port ' + port);
})
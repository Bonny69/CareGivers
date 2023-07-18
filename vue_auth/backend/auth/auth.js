const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcrypt');
mongoose.set('strictQuery', false);
const jwt = require('jsonwebtoken')

const app = express()
app.use(cors());
const port = process.env.port || 5000;

const database = async () => {
  try {
    await mongoose.connect('mongodb+srv://user:user@caregivers.rgfjqts.mongodb.net/Users?retryWrites=true&w=majority');
    console.log('DB connected');
  } catch (error) {
    console.log(error);
  }
};

app.use(express.json());
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
express.json()
database()


app.post('/signup', async (req, res) => {
  console.log('dentro signup server')
  
  const { user } = require('./user.js')
    const newUser = new user({
        nome: req.body.nome,
        cognome: req.body.cognome,
        dataDiNascita: req.body.dataDiNascita,
        email:req.body.email,
        password: bcrypt.hashSync(req.body.password,10),                               
        ruolo: req.body.ruolo
    })
    try{
    const utente = await newUser.save()
    console.log(utente)
    
    return res.status(200).json({
        message: "User created"
    });
    }catch(err){
      console.log("error => " + err)
      res.status(409).json({
      message: "ERROR"
      })
    }
});

app.post('/user', async(req,res)=>{
  const { user } = require('./user.js')
  try {
    const info = await user.findOne({email: req.body.email})
    if(info){
      res.status(200).json({
        nome: info.nome,
        cognome: info.cognome
      })
    }
  } catch (error) {
    console.log(error)
    res.status(500).json();
  }
})



app.post('/login',  async(req,res) =>{
  
  const { user } = require('./user.js')
  try {
    const User = await user.findOne({ email: req.body.email });
    if(!User){
      return res.status(400).json({
        title: 'user not found',
       error: 'invalid credentials'
     })
    }

    if(!bcrypt.compareSync(req.body.password,User.password)) {
      return res.status(401).json({
        title: 'login failed',
        error: 'invalid credentials'
      })
    }
    
    let token = jwt.sign({userID: User._id},'secretKey');
    return res.status(200).json({
      message: 'login avvenuto correttamente',
      token: token,
      email: User.email,
      ruolo: User.ruolo,
      nome: User.nome,
      cognome: User.cognome
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      title: 'server error',
      error: error
    });
  } 
});


app.listen(port,(err) => {
    if(err)
        console.log(err);
    console.log('server running on port ' + port);
})
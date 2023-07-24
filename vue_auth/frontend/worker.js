const { parentPort} = require('worker_threads');
const { encrypt } = require('./src/components/cipher');
const axios = require('axios');
let numeroTask = 0;
let numeroDrug = 0; 
let otp = 10001;
let countAlert = 0
let signUpNumber = 0;
let locks = {
    isAddingElementMemo : false,
    isAddingElementInserDrug : false,
    isAddingElementDeleteDrug : false,
    isAddingElementDeleteTask : false,
    isAddingElementGetMedia : false,
    isAddingElementGetPazientiHome : false,
    isAddingElementGetInfoUser : false,
    isAddingElementTimesInsertAlerts : false,
    isAddingElementTimesCreateOtp : false,
    isAddingElementCheckOtp : false,
    isAddingElementGetDataFromMongoDb : false,
    isAddingElementTimesInsertPvs : false,
    isAddingElementTimesSignUp : false
   }

   async function executeMethods(){
    let timesinsertMemo = []
    let timesinsertDrug = []
    let timesdeleteDrug  = []
    let timesDeleteTask = []
    let timesGetMedia = []
    let timesGetPazientiHome = []
    let timesGetInfoUser = []
    let timesInsertAlerts = []
    let timesCreateOtp = []
    let timesCheckOtp = []
    let timesGetDataFromMongoDb = []
    let timesInsertPvs = []
    let timesLogin = []

    const promises = [];
    

    
    promises.push(login().then((time) => timesLogin.push(time)));
    promises.push(getInfoUser().then((time) => timesGetInfoUser.push(time)));
    timesGetPazientiHome.push(getPazientiHome());
    
    timesinsertMemo.push(insertMemo());
    timesinsertDrug.push(insertDrug());
    timesInsertPvs.push(insertPvs());
    timesCreateOtp.push(createOtp());
    promises.push(checkOtp().then((time) => timesCheckOtp.push(time)));
    
    timesdeleteDrug.push(deleteDrug());
    timesDeleteTask.push(deleteTask());
    promises.push(getMedia().then((time) => timesGetMedia.push(time)));
    timesInsertAlerts.push(insertAlerts());
    promises.push(getDataFromMongoDb().then((time) => timesGetDataFromMongoDb.push(time)));
    

  // Wait for all the promises to complete
  await Promise.all(promises);

  // Calculate the averages
  let resultMemo = calculateAverage(timesinsertMemo);
  let resultDrug = calculateAverage(timesinsertDrug);
  let resultDeleteDrug = calculateAverage(timesdeleteDrug);
  let resultDeleteTask = calculateAverage(timesDeleteTask);
  let resultGetMedia = calculateAverage(timesGetMedia);
  let resultgetPazientiHome = calculateAverage(timesGetPazientiHome);
  let resultGetInfoUser = calculateAverage(timesGetInfoUser);
  let resultInsertAlerts = calculateAverage(timesInsertAlerts);
  let resultcreateOtp = calculateAverage(timesCreateOtp);
  let resultGetDataFromMongoDb = calculateAverage(timesGetDataFromMongoDb);
  let resultInsertPvs = calculateAverage(timesInsertPvs);
  let resultLogin = calculateAverage(timesLogin);
  let resultCheckOtp = calculateAverage(timesCheckOtp)

  result = [
    resultMemo,
    resultDrug,
    resultDeleteDrug,
    resultDeleteTask,
    resultGetMedia,
    resultgetPazientiHome,
    resultGetInfoUser,
    resultInsertAlerts,
    resultcreateOtp,
    resultCheckOtp ,
    resultGetDataFromMongoDb,
    resultInsertPvs,
    resultLogin
  ];
  parentPort.postMessage({ result });
}

function calculateAverage(arr) {
    if (!Array.isArray(arr) || arr.length === 0) {
      return 0;
    }
  
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i];
    }
  
    const average = sum / arr.length;
    return average;
  }

  async function login(){
    let loggedUser = {
      email: encrypt('a@gmail.com'),
      password: encrypt('ciao')
    };
    const startTime = Date.now()
    await axios.post("http://localhost:5000/login", loggedUser).then(()=>{
      const endTime = Date.now()
      return endTime-startTime
    })
  }

 function insertMemo() {
  const memoCiphered = {
          evento: 'guardia medica' + numeroTask++,
          data: '12/01/2023',
          orario: '15:56',
          email_paziente: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
      const startTime = Date.now()
       axios.post("http://localhost:5002/insertMemo", memoCiphered).then(()=>{
        const endTime = Date.now()
        return endTime- startTime
       })
     
  } catch (error) {
      console.log(error)
  }
}

 function insertDrug() {
  const medicinaleCiphered = {
          farmaco: 'aulin' + numeroDrug++,
          orario: '16:50',
          dosaggio: '150',
          email_paziente: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
    const startTime = Date.now()
     axios.post("http://localhost:5002/insertTherapy", medicinaleCiphered).then(()=>{
      const endTime = Date.now()
      return endTime - startTime;
     })
    
  } catch (error) {
      console.log(error)
  }
}

 function deleteDrug() {
  const medicinale = {
          farmaco: 'aulin' + --numeroDrug,
          email: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
    const startTime = Date.now()
     axios.post("http://localhost:5002/deleteDrug", medicinale).then(()=>{
      const endTIme = Date.now()
      return endTIme - startTime
     })
    
  } catch (error) {
    console.log(error)
  }
}

 function deleteTask() {
  const task = {
          evento: 'guardia medica' + --numeroTask,
          email: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
    const startTime = Date.now()
     axios.post("http://localhost:5002/deleteTask", task).then(() => {
      const endTime = Date.now()
      return endTime-startTime
     })
    
  } catch (error) {
    console.log(error)
  }
  numeroTask++
}

async function getMedia() {
  const data = {
    collection: '771c2c3afda9151482bee26ec7052f98' + '/vitalparameters',
    firstDate: '24/07/2023',
    secondDate: '24/08/2023',
    parametro: 'fc',
  };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5005/getMedia", data).then(() => {
      const endTime = Date.now()
      return endTime-startTime
    })
  } catch (error) {
    console.log(error)
  }
}

 function getPazientiHome(){
  const email = {
    email_caregiver: '3cf69e2d70eedc2100b8d2b303d49792',
  };
  try {
    const startTime = Date.now()
     axios.post("http://localhost:5001/home", email).then(() =>{
      const endTime = Date.now()
      return endTime-startTime
     })
  } catch (error) {
    console.log(error)
  }
}

async function getInfoUser(){
  const data = {
    email: '3cf69e2d70eedc2100b8d2b303d49792',
  };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5000/user", data).then(()=>{
      const endTime = Date.now()
      return endTime-startTime
    });
  } catch (error) {
    console.log(error)
  }
}


 function insertAlerts(){
  const data = {
    email: generateRandomString(20),
    fc: '120',
    spO2: '97',
    systolic: '150',
    diastolic: '110',
  };
  try {
    const startTime = Date.now()
     axios.post("http://localhost:5005/insertAlerts", data).then(()=>{
      const endTime = Date.now()
      countAlert++
      return endTime-startTime
     })
    
  } catch (error) {
    console.log(error)
  } 
}

function generateRandomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }

  return result;
}

 function createOtp(){
  otp++
  const data = {
    otp: otp.toString(),
    email: '771c2c3afda9151482bee26ec7052f98',
  };
  try {
    const startTime = Date.now()
    axios.post("http://localhost:5001/insertOtp", data).then(()=>{
      const endTime = Date.now()
      return endTime-startTime
    })
  } catch (error) {
    console.log(error)
  }
}

async function checkOtp(){
  const data = {
    otp: '10000',
    email_paziente: '771c2c3afda9151482bee26ec7052f98',
    email_caregiver: '3cf69e2d70eedc2100b8d2b303d49792',
  };
  try {
    const startTime = Date.now()
    axios.post("http://localhost:5001/checkOtp", data).then(()=>{
      const endTime = Date.now()
      return endTime-startTime
    })
  } catch (error) {
    console.log(error)
  }
}

 async function getDataFromMongoDb(){
  const rifPaziente = '771c2c3afda9151482bee26ec7052f98';
  const collezione = rifPaziente + "/vitalparameters";
  const randomNumber = Math.floor(Math.random() * 3) + 1;
  let param;
  if(randomNumber === 1){
      param = 'fc'
  }else{
    if(randomNumber === 2){
      param = 'spO2'
    }else{
      param = 'bp'
    }
  }

  let data = {
    field: param,
    collection: collezione,
  };

  if (param === "bp") {
    data = {
      field: "systolic",
      field2: "diastolic",
      collection: collezione,
    };
  }
  try {
    const startTime = Date.now()
     await axios.get("http://localhost:5005/getData", { params: data }).then(()=>{
      const endTime = Date.now()
      return endTime-startTime
     })
  } catch (error) {
    console.log(error)
  }
}


 function insertPvs(){
  let object = {
    fc: '120',
    spO2: '98',
    systolic: '130',
    diastolic: '100',
    collection: '771c2c3afda9151482bee26ec7052f98'+ "/vitalparameters",
  };
  try {
    const startTime = Date.now()
     axios.post("http://localhost:5005/insertPv", object).then(()=>{
      const endTime = Date.now()
      return endTime-startTime
     })
  } catch (error) {
    console.log(error)
  }
}

async function signUp(){
  let ruoloUser
  if(signUpNumber%2==0){
     ruoloUser = 'paziente'
  }else{
     ruoloUser = 'caregiver'
  }
  let newUser = {
    nome: 'ale',
    cognome: 'cas',
    dataDiNascita: '12/02/1998',
    email: 'cassa@gmail.com)' + signUpNumber++,
    password: 'ciao',
    ripetiPassword: 'ciao',
    ruolo: ruoloUser,
  };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5000/signup", newUser);
    const endTime = Date.now()
    return endTime-startTime
  } catch (error) {
    console.log(error)
  }
}

executeMethods()
  
const { parentPort, workerData } = require('worker_threads');
const axios = require('axios');
let numeroTask = 0;
let numeroDrug = 0; 
let otp = 10001;
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
    promises.push(getPazientiHome().then((time) => timesGetPazientiHome.push(time)));
    
    promises.push(insertMemo().then((time) => timesinsertMemo.push(time)));
    promises.push(insertDrug().then((time) => timesinsertDrug.push(time)));
    promises.push(insertPvs().then((time) => timesInsertPvs.push(time)));
    promises.push(createOtp().then((time) => timesCreateOtp.push(time)));
    promises.push(checkOtp().then((time) => timesCheckOtp.push(time)));
    
    promises.push(deleteDrug().then((time) => timesdeleteDrug.push(time)));
    promises.push(deleteTask().then((time) => timesDeleteTask.push(time)));
    promises.push(getMedia().then((time) => timesGetMedia.push(time)));
    promises.push(insertAlerts().then((time) => timesInsertAlerts.push(time)));
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
  let resultLogin = calculateAverage(timesSignUp);
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
      password: encrypt('ciao'),
    };
    const startTime = Date.now()
    await axios.post("http://localhost:5000/login", loggedUser)
    const endTime = Date.now()
    return endTime-startTime
  }

async function insertMemo() {
  const memoCiphered = {
          evento: 'guardia medica' + numeroTask++,
          data: '12/01/2023',
          orario: '15:56',
          email_paziente: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
      const startTime = Date.now()
      await axios.post("http://localhost:5002/insertMemo", memoCiphered)
      const endTime = Date.now()
      return endTime- startTime
  } catch (error) {
      console.log(error)
  }
}

async function insertDrug() {
  const medicinaleCiphered = {
          farmaco: 'aulin' + numeroDrug++,
          orario: '16:50',
          dosaggio: '150',
          email_paziente: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5002/insertTherapy", medicinaleCiphered)
    const endTime = Date.now()
    return endTime - startTime;
  } catch (error) {
      console.log(error)
  }
}

async function deleteDrug() {
  const medicinale = {
          farmaco: 'aulin' + --numeroDrug,
          email: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5002/deleteDrug", medicinale)
    const endTIme = Date.now()
    return endTIme - startTime
  } catch (error) {
    console.log(error)
  }
}

async function deleteTask() {
  const task = {
          evento: 'guardia medica' + --numeroTask,
          email: '771c2c3afda9151482bee26ec7052f98',
        };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5002/deleteTask", task)
    const endTime = Date.now()
    return endTime-startTime
  } catch (error) {
    console.log(error)
  }
  numeroTask++
}

async function getMedia() {
  const data = {
    collection: '771c2c3afda9151482bee26ec7052f98' + '/vitalparameters',
    firstDate: '20/07/2023',
    secondDate: '21/08/2023',
    parametro: 'fc',
  };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5005/getMedia", data)
    const endTime = Date.now()
    return endTime-startTime
  } catch (error) {
    console.log(error)
  }
}

async function getPazientiHome(){
  const email = {
    email_caregiver: '3cf69e2d70eedc2100b8d2b303d49792',
  };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5001/home", email)
    const endTime = Date.now()
    return endTime-startTime
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
    await axios.post("http://localhost:5000/user", data);
    const endTime = Date.now()
    return endTime-startTime
  } catch (error) {
    console.log(error)
  }
}


async function insertAlerts(){
  const data = {
    email: '771c2c3afda9151482bee26ec7052f98',
    fc: '120',
    spO2: '97',
    systolic: '150',
    diastolic: '110',
  };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5005/insertAlerts", data)
    const endTime = Date.now()
    return endTime-startTime
  } catch (error) {
    console.log(error)
  } 
}

async function createOtp(){
  otp++
  const data = {
    otp: otp.toString(),
    email: '771c2c3afda9151482bee26ec7052f98',
  };
  try {
    const startTime = Date.now()
    axios.post("http://localhost:5001/insertOtp", data)
    const endTime = Date.now()
    return endTime-startTime
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
    axios.post("http://localhost:5001/checkOtp", data)
    const endTime = Date.now()
    return endTime-startTime
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
    await axios.get("http://localhost:5005/getData", { params: data })
    const endTime = Date.now()
    return endTime-startTime
  } catch (error) {
    console.log(error)
  }
}


async function insertPvs(){
  let object = {
    fc: '120',
    spO2: '98',
    systolic: '130',
    diastolic: '100',
    collection: '771c2c3afda9151482bee26ec7052f98 '+ "/vitalparameters",
  };
  try {
    const startTime = Date.now()
    await axios.post("http://localhost:5005/insertPv", object)
    const endTime = Date.now()
    return endTime-startTime
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
  
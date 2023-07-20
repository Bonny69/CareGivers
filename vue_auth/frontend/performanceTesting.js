const { create } = require('core-js/core/object');
const { Worker, isMainThread, parentPort, workerData } = require('worker_threads');
let numeroTask = 0;
let numeroDrug = 0; 

async function insertMemo() {
  const memoCiphered = {
          evento: 'guardia medica' + numeroTask++,
          data: '12/01/2023',
          orario: '15:56',
          email_paziente: '771c2c3afda9151482bee26ec7052f98',
        };
  const startTime = Date.now()
  await axios.post("http://localhost:5002/insertMemo", memoCiphered)
  const endTime = Date.now()
  return endTime- startTime
}

async function insertDrug() {
  const medicinaleCiphered = {
          farmaco: 'aulin' + numeroDrug++,
          orario: '16:50',
          dosaggio: '150',
          email_paziente: '771c2c3afda9151482bee26ec7052f98',
        };
const startTime = Date.now()
await axios.post("http://localhost:5002/insertTherapy", medicinaleCiphered)
const endTime = Date.now()
return endTime - startTime;
}

async function deleteDrug() {
  const medicinale = {
          farmaco: 'aulin' + --numeroDrug,
          email: '771c2c3afda9151482bee26ec7052f98',
        };
  const startTime = Date.now()
  await axios.post("http://localhost:5002/deleteDrug", medicinale)
  const endTIme = Date.now()
  numeroDrug++
  return endTIme - startTime
}

async function deleteTask() {
  const task = {
          evento: 'guardia medica' + --numeroTask,
          email: '771c2c3afda9151482bee26ec7052f98',
        };
  const startTime = Date.now()
  await axios.post("http://localhost:5002/deleteTask", task)
  const endTime = Date.now()
  numeroTask++
  return endTime-startTime
}

async function getMedia() {
  const data = {
    collection: '771c2c3afda9151482bee26ec7052f98' + '/vitalparameters',
    firstDate: '16/07/2023',
    secondDate: '18/08/2023',
    parametro: 'fc',
  };
  const startTime = Date.now()
  await axios.post("http://localhost:5005/getMedia", data)
  const endTime = Date.now()
  return endTime-startTime
}

async function getPazientiHome(){
  const email = {
    email_caregiver: '3cf69e2d70eedc2100b8d2b303d49792',
  };
  const startTime = Date.now()
  await axios.post("http://localhost:5001/home", email)
  const endTime = Date.now()
  return endTime-startTime
}

async function getInfoUser(){
  const data = {
    email: '3cf69e2d70eedc2100b8d2b303d49792',
  };
  const startTime = Date.now()
  await axios.post("http://localhost:5000/user", data);
  const endTime = Date.now()
  return endTime-startTime
}


async function insertAlerts(){
  const data = {
    email: '771c2c3afda9151482bee26ec7052f98',
    fc: '120',
    spO2: '97',
    systolic: '150',
    diastolic: '110',
  };
  const startTime = Date.now()
  await axios.post("http://localhost:5005/insertAlerts", data)
  const endTime = Date.now()
  return endTime-startTime
}


let otp = 10000
async function createOtp(){
  otp = otp++
  const data = {
    otp: otp.toString(),
    email: sessionStorage.getItem("email"),
  };
  const startTime = Date.now()
  axios.post("http://localhost:5001/insertOtp", data)
  const endTime = Date.now()
  return endTime-startTime
}

async function checkOtp(){
  const data = {
    otp: otp.toString(),
    email_paziente: '771c2c3afda9151482bee26ec7052f98',
    email_caregiver: '3cf69e2d70eedc2100b8d2b303d49792',
  };
  const startTime = Date.now()
  axios.post("http://localhost:5001/checkOtp", data)
  const endTime = Date.now()
  return endTime-startTime
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
  const startTime = Date.now()
  await axios.get("http://localhost:5005/getData", { params: data })
  const endTime = Date.now()
  return endTime-startTime
}


async function insertPvs(){
  let object = {
    fc: '120',
    spO2: '98',
    systolic: '130',
    diastolic: '100',
    collection: '771c2c3afda9151482bee26ec7052f98 '+ "/vitalparameters",
  };
  const startTime = Date.now()
  await axios.post("http://localhost:5005/insertPv", object)
  const endTime = Date.now()
  return endTime-startTime
}

let signUpNumber = 0;
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
  const startTime = Date.now()
  await axios.post("http://localhost:5000/signup", newUser);
  const endTime = Date.now()
  return endTime-startTime
}

// Function to create and start a worker thread for a given method
function startWorkerThread(methodId, callback) {
  const worker = new Worker(__filename, { workerData: methodId });

  worker.on('message', (result) => {
    callback(result);
  });

  worker.on('error', (error) => {
    console.error(`Worker error: ${error}`);
  });

  worker.on('exit', (code) => {
    if (code !== 0) {
      console.error(`Worker for Method ${methodId} stopped with exit code ${code}`);
    }
  });
}
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
let timesSignUp = []



// Function to simulate calling a method
function simulateMethod(methodId) {
  console.log(`Worker Thread ${workerData} executing Method ${methodId}...`);
  let result;
  switch (methodId) {
    case 1:
      result = insertMemo();
      times[1]
      break;
    case 2:
      result = insertDrug();
      break;
    case 3:
        result = deleteDrug()
        break;
    case 4:
        result = deleteTask()
        break;
    case 5:
        result = getMedia()
        break;
    case 6:
        result = getPazientiHome()
        break;
    case 7:
        result = getInfoUser()
        break;
    case 8:
        result = insertAlerts()
        break;
    case 9:
        result = createOtp()
        break;
    case 10:
        result = checkOtp()
        break;
    case 11:
         result = getDataFromMongoDb()
         break;
    case 12:
         result = insertPvs()
         break;
    case 13:
         result = signUp()
         break;
    default:
      result = { message: `Unknown method: ${methodId}` };
  }
  console.log(`Response from Worker Thread ${workerData}, Method ${methodId}:`, result);
}

// Measure the execution time for multiple threads and methods
const NUM_THREADS = 100;
const NUM_METHODS = 13;

let completedThreads = 0;

function handleThreadResult() {
  completedThreads++;

  if (completedThreads === NUM_THREADS) {
    console.log('All threads completed.');
  }
}

// Launch multiple worker threads to run the methods
for (let i = 1; i <= NUM_THREADS; i++) {
  for (let j = 1; j <= NUM_METHODS; j++) {
    startWorkerThread(j, handleThreadResult);
  }
}

// Worker thread code
if (!isMainThread) {
  const methodId = workerData;

  // Simulate calling all methods for each worker thread
  for (let j = 1; j <= NUM_METHODS; j++) {
    simulateMethod(methodId);
  }

  // Notify the main thread that all methods are completed
  parentPort.postMessage('Worker Thread completed');
}

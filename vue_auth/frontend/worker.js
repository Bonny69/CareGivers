  const { parentPort} = require('worker_threads');
  const { encrypt } = require('./src/components/cipher');
  const axios = require('axios');
  let numeroTask = 0;
  let numeroDrug = 0; 
  let otp = 10001;
  let countAlert = 0
  let locks = {
      isAddingElementMemo : false,
      isAddingElementInserDrug : false,
      isAddingElementDeleteDrug : false,
      isAddingElementDeleteTask : false,
      isAddingElementGetMedia : false,
      isAddingElementgetMemos : false,
      isAddingElementGetFarmaci: false,
      isAddingElementTimesInsertAlerts : false,
      isAddingElementTimesCreateOtp : false,
      isAddingElementCheckOtp : false,
      isAddingElementGetDataFromMongoDb : false,
      isAddingElementTimesInsertPvs : false,
      isAddingElementLogin : false
    }

      let timesinsertDrug = []
      let timesGetMedia = []
      let timesInsertAlerts = []
      let timesGetMemos = []
      let timesInsertPvs = []

    async function executeMethods(){
      const promises = [];

      let resultDrug 
      let resultGetMedia 
      let resultInsertAlerts 
      let resultInsertPvs 
      let resultGetMemos
     

      promises.push(insertAlerts().then((time) =>{
        acquireLock('isAddingElementTimesInsertAlerts')
        timesInsertAlerts.push(time)
        releaseLock('isAddingElementTimesInsertAlerts')
      }));
      promises.push(wait(1000).then(() => insertDrug().then((time) => {
        acquireLock('isAddingElementInserDrug');
        timesinsertDrug.push(time);
        releaseLock('isAddingElementInserDrug');
      })));
    
      promises.push(wait(100).then(() => getMedia().then((time) => {
        acquireLock('isAddingElementGetMedia');
        timesGetMedia.push(time);
        releaseLock('isAddingElementGetMedia');
      })));
    
      promises.push(wait(100).then(() => insertPvs().then((time) => {
        acquireLock('isAddingElementTimesInsertPvs');
        timesInsertPvs.push(time);
        releaseLock('isAddingElementTimesInsertPvs');
      })));
    
      promises.push(wait(1000).then(() => getMemos().then((time) => {
        acquireLock('isAddingElementgetMemos');
        timesGetMemos.push(time);
        releaseLock('isAddingElementgetMemos');
      })));
      
    await Promise.all(promises);

    resultDrug = calculateAverage(timesinsertDrug);
    resultGetMedia = calculateAverage(timesGetMedia);
    resultInsertPvs = calculateAverage(timesInsertPvs);
    resultGetMemos = calculateAverage(timesGetMemos);
    resultInsertAlerts = calculateAverage(timesInsertAlerts)

    const result = [
      resultDrug,
      resultGetMedia,
      resultGetMemos,
      resultInsertPvs,
      resultInsertAlerts
    ];
    parentPort.postMessage({ result });
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function calculateAverage(arr) {
      if (!Array.isArray(arr) || arr.length === 0) {
        return 0;
      }
      let sum = 0;
      for (let i = 0; i < arr.length; i++) {
        if(arr[i] != -1){
        sum += arr[i];
        }
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
      await axios.post("http://localhost:5000/login", loggedUser)
      const endTime = Date.now()
      return endTime-startTime
    }
    
    async function insertMemo() {
      const memoCiphered = {
              evento: 'guardia medica' + numeroTask++,
              data: '12/01/2023',
              orario: '15:56',
              email_paziente: generateRandomString(10),
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
        email_paziente: generateRandomString(10),
      };
      const startTime = Date.now();
      try {
        await axios.post("http://localhost:5002/insertTherapy", medicinaleCiphered);
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        console.log(error);
        return -1;
      }
    }
    
    async function getMedia() {
      const data = {
        collection: '771c2c3afda9151482bee26ec7052f98' + '/vitalparameters',
        firstDate: '31/07/2023',
        secondDate: '24/08/2023',
        parametro: 'fc',
      };
      const startTime = Date.now();
      try {
        await axios.post("http://localhost:5005/getMedia", data);
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        console.log(error);
        return -1;
      }
    }
    
    async function getPazientiHome() {
      const email = {
        email_caregiver: '3cf69e2d70eedc2100b8d2b303d49793',
      };
      try {
        const startTime = Date.now();
        await axios.post("http://localhost:5001/home", email)
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        console.log(error);
      }
    }
    
    async function getInfoUser() {
      const data = {
        email: '3cf69e2d70eedc2100b8d2b303d49792',
      };
      try {
        const startTime = Date.now();
        await axios.post("http://localhost:5000/user", data);
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        console.log(error);
      }
    }
    

    async function insertAlerts() {
      const data = {
        email: generateRandomString(20),
        fc: '120',
        spO2: '97',
        systolic: '150',
        diastolic: '110',
      };
      try {
        const startTime = Date.now();
        await axios.post("http://localhost:5005/insertAlerts", data);
        const endTime = Date.now();
        countAlert++;
        return endTime - startTime;
      } catch (error) {
        console.log(error);
        return -1;
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

  async function createOtp() {
    const data = {
      otp: otp.toString(),
      email: generateRandomString(15)
    };
    const startTime = Date.now();
    try {
      await axios.post("http://localhost:5001/insertOtp", data);
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.log(error);
    }
  }

  async function checkOtp() {
    const data = {
      otp: '00000',
      email_paziente: '771c2c3afda9151482bee26ec7052f88',
      email_caregiver: generateRandomString('20'),
    };
    try {
      const startTime = Date.now();
      await axios.post("http://localhost:5001/checkOtp", data);
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.log(error);
    }
  }

  async function getDataFromMongoDb() {
    const rifPaziente = '771c2c3afda9151482bee26ec7052f98';
    const collezione = rifPaziente + "/vitalparameters";
    const randomNumber = Math.floor(Math.random() * 3) + 1;
    let param;
    if (randomNumber === 1) {
      param = 'fc';
    } else if (randomNumber === 2) {
      param = 'spO2';
    } else {
      param = 'bp';
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
      const startTime = Date.now();
      await axios.get("http://localhost:5005/getData", { params: data });
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.log(error);
    }
  }

  async function getMemos(){
    const email = { email: '771c2c3afda9151482bee26ec7052f98'};
    try {
      const startTime = Date.now();
      await axios.get("http://localhost:5002/getMemos", { params: email })
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async function getFarmaci(){
    const email = { email: '771c2c3afda9151482bee26ec7052f98'};
    try {
      const startTime = Date.now();
      await axios.get("http://localhost:5002/getTherapy", { params: email })
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.log(error);
    }
  }

  async function insertPvs() {
    let object = {
      fc: '120',
      spO2: '98',
      systolic: '130',
      diastolic: '100',
      collection: 'testing' + "/vitalparameters",
    };
    try {
      const startTime = Date.now();
      await axios.post("http://localhost:5005/insertPv", object);
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.log(error);
      return -1;
    }
  }

  async function acquireLock(lockName) {
    while (locks[lockName]) {
      await new Promise((resolve) => setTimeout(resolve, 10));
    }
    locks[lockName] = true;
  }

  function releaseLock(lockName) {
    locks[lockName] = false;
  }

  async function run() {
    await executeMethods();
  }

  run();
    
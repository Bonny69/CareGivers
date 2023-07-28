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
      isAddingElementGetPazientiHome : false,
      isAddingElementGetInfoUser : false,
      isAddingElementTimesInsertAlerts : false,
      isAddingElementTimesCreateOtp : false,
      isAddingElementCheckOtp : false,
      isAddingElementGetDataFromMongoDb : false,
      isAddingElementTimesInsertPvs : false,
      isAddingElementLogin : false
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
      let timesLogin = []

    async function executeMethods(){
      const promises = [];

      let resultMemo 
      let resultDrug 
      let resultDeleteDrug 
      let resultDeleteTask 
      let resultGetMedia 
      let resultgetPazientiHome 
      let resultGetInfoUser 
      let resultInsertAlerts 
      let resultcreateOtp 
      let resultGetDataFromMongoDb 
      let resultInsertPvs 
      let resultLogin 
      let resultCheckOtp 
      promises.push(login().then((time) =>{
        acquireLock('isAddingElementLogin')
        timesLogin.push(time)
        releaseLock('isAddingElementLogin')
      }))
      promises.push(getInfoUser().then((time) => {
        acquireLock('isAddingElementGetInfoUser')
        timesGetInfoUser.push(time)
        releaseLock('isAddingElementGetInfoUser')
      }));
      promises.push(createOtp().then((time) => {
        acquireLock('isAddingElementTimesCreateOtp')
        timesCreateOtp.push(time)
        releaseLock('isAddingElementTimesCreateOtp')
      }));
      promises.push(checkOtp().then((time) =>{
        acquireLock('isAddingElementCheckOtp')
        timesCheckOtp.push(time)
        otp++;
        releaseLock('isAddingElementCheckOtp')
      }));
      promises.push(getPazientiHome().then((time) =>{ 
        acquireLock('isAddingElementGetPazientiHome')
        timesGetPazientiHome.push(time)
        releaseLock('isAddingElementGetPazientiHome')
      }))
      promises.push(insertMemo().then((time) =>{
        acquireLock('isAddingElementMemo')
        timesinsertMemo.push(time)
        releaseLock('isAddingElementMemo')
      }));
      promises.push(insertDrug().then((time) =>{
        acquireLock('isAddingElementInserDrug')
        timesinsertDrug.push(time)
        releaseLock('isAddingElementInserDrug')
        }));
      promises.push(getMedia().then((time) =>{
        acquireLock('isAddingElementGetMedia')
        timesGetMedia.push(time)
        releaseLock('isAddingElementGetMedia')
      }));
      promises.push(insertAlerts().then((time) =>{
        acquireLock('isAddingElementTimesInsertAlerts')
        timesInsertAlerts.push(time)
        releaseLock('isAddingElementTimesInsertAlerts')
      }));
      promises.push(getDataFromMongoDb().then((time) =>{
        acquireLock('isAddingElementGetDataFromMongoDb')
        timesGetDataFromMongoDb.push(time)
        releaseLock('isAddingElementGetDataFromMongoDb')
      }));
      promises.push(insertPvs().then((time) =>{
        acquireLock('isAddingElementTimesInsertPvs')
        timesInsertPvs.push(time)
        releaseLock('isAddingElementTimesInsertPvs')
      }));
    
      
    await Promise.all(promises);

    resultMemo = calculateAverage(timesinsertMemo);
    resultDrug = calculateAverage(timesinsertDrug);
    resultDeleteDrug = calculateAverage(timesdeleteDrug);
    resultDeleteTask = calculateAverage(timesDeleteTask);
    resultGetMedia = calculateAverage(timesGetMedia);
    resultgetPazientiHome = calculateAverage(timesGetPazientiHome);
    resultGetInfoUser = calculateAverage(timesGetInfoUser);
    resultInsertAlerts = calculateAverage(timesInsertAlerts);
    resultcreateOtp = calculateAverage(timesCreateOtp);
    resultGetDataFromMongoDb = calculateAverage(timesGetDataFromMongoDb);
    resultInsertPvs = calculateAverage(timesInsertPvs);
    resultLogin = calculateAverage(timesLogin);

    const result = [
      resultMemo,
      resultDrug,
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
      const startTime = Date.now();
      try {
        await axios.post("http://localhost:5002/insertTherapy", medicinaleCiphered);
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        console.log(error);
      }
    }
    
    async function deleteDrug() {
      const medicinale = {
        farmaco: 'aulin' + --numeroDrug,
        email: '771c2c3afda9151482bee26ec7052f98',
      };
      const startTime = Date.now();
      try {
        await axios.post("http://localhost:5002/deleteDrug", medicinale);
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        console.log(error);
      }
    }
    
    async function deleteTask() {
      const task = {
        evento: 'guardia medica' + --numeroTask,
        email: '771c2c3afda9151482bee26ec7052f98',
      };
      const startTime = Date.now();
      try {
        await axios.post("http://localhost:5002/deleteTask", task);
        const endTime = Date.now();
        return endTime - startTime;
      } catch (error) {
        console.log(error);
      }
      numeroTask++;
    }
    
    async function getMedia() {
      const data = {
        collection: '771c2c3afda9151482bee26ec7052f98' + '/vitalparameters',
        firstDate: '27/07/2023',
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
      const startTime = Date.now();
      try {
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

  async function insertPvs() {
    let object = {
      fc: '120',
      spO2: '98',
      systolic: '130',
      diastolic: '100',
      collection: '771c2c3afda9151482bee26ec7052f98' + "/vitalparameters",
    };
    try {
      const startTime = Date.now();
      await axios.post("http://localhost:5005/insertPv", object);
      const endTime = Date.now();
      return endTime - startTime;
    } catch (error) {
      console.log(error);
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
    
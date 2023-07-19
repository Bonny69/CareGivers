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
  await axios.post("http://localhost:5002/insertMemo", memoCiphered)
}

async function insertDrug() {
  const medicinaleCiphered = {
          farmaco: 'aulin' + numeroDrug++,
          orario: '16:50',
          dosaggio: '150',
          email_paziente: '771c2c3afda9151482bee26ec7052f98',
        };

        await axios
          .post("http://localhost:5002/insertTherapy", medicinaleCiphered)
}

async function deleteDrug() {
  const medicinale = {
          farmaco: 'aulin' + --numeroDrug,
          email: '771c2c3afda9151482bee26ec7052f98',
        };

        await axios
          .post("http://localhost:5002/deleteDrug", medicinale)
          numeroDrug++
}

async function deleteTask() {
  const task = {
          evento: 'guardia medica' + --numeroTask,
          email: '771c2c3afda9151482bee26ec7052f98',
        };

        await axios
          .post("http://localhost:5002/deleteTask", task)
          numeroTask++
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

// Function to simulate calling a method
function simulateMethod(methodId) {
  console.log(`Worker Thread ${workerData} executing Method ${methodId}...`);
  let result;
  switch (methodId) {
    case 1:
      result = method1();
      break;
    case 2:
      result = method2();
      break;
    // Add more cases for additional methods if needed
    default:
      result = { message: `Unknown method: ${methodId}` };
  }
  console.log(`Response from Worker Thread ${workerData}, Method ${methodId}:`, result);
}

// Measure the execution time for multiple threads and methods
const NUM_THREADS = 5;
const NUM_METHODS = 2;

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
    simulateMethod(j);
  }

  // Notify the main thread that all methods are completed
  parentPort.postMessage('Worker Thread completed');
}

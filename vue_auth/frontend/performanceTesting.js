    const NUM_THREADS = 100;
    const { Worker, isMainThread} = require('worker_threads'); 


    function createWorker() {
      try {
        return new Worker('./worker.js')
      } catch (error) {
        console.error('Error creating worker:', error);
        return null;
      }
    }

    async function simulateThreads() {
      const workerPromises = [];
      let risultati = [];
    
      for (let i = 0; i < NUM_THREADS; i++) {
        const worker = createWorker();
        worker.postMessage({ i });
    
        const workerPromise = new Promise((resolve) => {
          worker.on('message', (message) => {
            const result = message.result;
            console.log('Result from the worker thread:', result);
            resolve(result); 
          });
        });
    
        workerPromises.push(workerPromise);
      }
    
      try {
        const resultArrays = await Promise.all(workerPromises);
        const numWorkers = resultArrays.length;
        const numElements = resultArrays[0].length;
      
        const { sumArray, validCounts } = resultArrays.reduce(
          (acc, curr) => {
            curr.forEach((val, i) => {
              if (val !== 0) {
                acc.sumArray[i] += val;
                acc.validCounts[i]++;
              }
            });
            return acc;
          },
          { sumArray: new Array(numElements).fill(0), validCounts: new Array(numElements).fill(0) }
        );
      
        const averageArray = sumArray.map((sum, i) => (validCounts[i] > 0 ? sum / validCounts[i] : 0));
      
        console.log('Average value for every index:', averageArray);
      } catch (error) {
        console.error('Error while processing worker promises:', error);
      }
    }

    if (isMainThread) {
      try {
        simulateThreads();
      } catch (error) {
        console.log('Main thread error:', error);
      }
    }

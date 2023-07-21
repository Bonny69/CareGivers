    const NUM_THREADS = 2;
    const { Worker, isMainThread, parentPort } = require('worker_threads'); 


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
    
      for (let i = 0; i < NUM_THREADS; i++) {
        const worker = createWorker();
        worker.postMessage({ i });
    
        // Wrap the worker event handling in a promise and push it to the workerPromises array
        const workerPromise = new Promise((resolve) => {
          worker.on('message', (message) => {
            const result = message.result
            console.log('Result from the worker thread:', result);
          });
        });
    
        workerPromises.push(workerPromise);
      }
    
      // Wait for all worker threads to finish their tasks and gather their results
      const results = await Promise.all(workerPromises);
    
      // Log the results
      console.log('All threads completed their work.');
      console.log('Results:', results);
    }


    if (isMainThread) {
      try {
        simulateThreads();
      } catch (error) {
        console.log(error)
      }
    }

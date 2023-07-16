
export const spO2 = {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "SpO2",
          data: [],
          backgroundColor: "#03dac5",
          borderColor: "#ffffff",
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      lineTension: 1,
      scales: {
        xAxes: [
          {
            ticks: {
              maxTicksLimit: 10, // Limit the number of x-axis ticks to 10
              padding: 25,
              fontColor: 'white',
              fontSize: 14,
              

            }
          }
        ],
        yAxes: [
          {
            ticks: {
              beginAtZero: false,  
              padding: 25,
              precision: 0,
              min:60,
              max:100,
              fontColor: 'white',
              fontSize: 14,
            }
          }
        ]
      },
      legend: {
        labels: {
          fontColor: 'white', // Set the legend text color to white
          fontSize: 16,
        }
    }
  }
};
  
  export default spO2;
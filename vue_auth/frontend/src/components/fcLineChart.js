
export const fc = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "FC",
        fontColor:'white',
        data: [],
        backgroundColor: "#03dac5",
        borderColor: "#ffffff",
        borderWidth: 3,
        labelColor: 'white'
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
            beginAtZero: true,  
            padding: 25,
            fontColor: 'white',
            fontSize: 14,
          }
        }
      ]
    },
    legend: {
      labels: {
        fontColor: 'white',
        fontSize: 16,
      }
  }}
};

export default fc;
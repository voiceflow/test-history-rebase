import React, { Component } from 'react'
import { Line, Chart } from 'react-chartjs-2'

Chart.defaults.global.defaultFontColor = '#8da2b5'


class LineBar extends Component{
  render(){
    const data={
      labels: this.props.dates,
      datasets: [
        {
          backgroundColor: 'rgba(96, 146, 255,0.2)',
          borderColor: 'rgba(96, 146, 255, 1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(96, 146, 255,0.4)',
          hoverBorderColor: 'rgba(96, 146, 255, 1)',
          data: this.props.dau,
          cubicInterpolationMode: 'monotone',
          defaultFontColor: '#8da2b5',
          defaultFontSize: '20px',
          lineTension: '120'
        }
      ]
    }

    const options={
      legend: {
        display: false
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false,
            color: '#8da2b530',
            zeroLineColor: '#8da2b530'
          }
        }],
        yAxes: [{
          gridLines: {
            display: true,
            color: '#8da2b530',
            zeroLineColor: '#8da2b530'
          },
          ticks: {
            min: 0
          }
        }]
      }
    }

    return(
      <Line data={data} options={options}/>
    )
  }
}

export default LineBar
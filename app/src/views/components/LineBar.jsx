import React, { Component } from 'react'
import color from '@material-ui/core/colors/lightBlue';
import { Line, Chart } from 'react-chartjs-2'

Chart.defaults.global.defaultFontColor = '#8da2b5'


class LineBar extends Component{
  constructor(props){
    super(props)
  }

  render(){
    const data={
      labels: this.props.dates,
      datasets: [
        {
          label: 'Daily Active Users',
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
        labels: {
            // This more specific font property overrides the global property
            fontColor: '#8da2b5',
        },
      },
      scales: {
        xAxes: [{
          gridLines: {
            display: false
          }
        }],
        yAxes: [{
          gridLines: {
            display: false
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
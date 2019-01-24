import React, { Component } from 'react'
import { Line } from 'react-chartjs-2'

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
          cubicInterpolationMode: 'monotone'
        }
      ]
    }
    return(
      <Line data={data}/>
    )
  }
}

export default LineBar
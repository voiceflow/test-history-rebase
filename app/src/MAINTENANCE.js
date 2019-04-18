
const _ = require('lodash')
const moment = require('moment')

// MAINTENANCE - TURN OFF WHEN NOT IN USE FOR PERFORMANCE
const MAINTENANCE = true

// MAINTENANCE SETTINGS

// ISO standard time in GMT
const MAINTENANCE_START='2019-04-19T00:00:00Z'
// downtime in minutes
const MAINTENANCE_TIME=120
// how many minutes out to do warnings
const WARNING_INTERVALS=[60, 30, 10, 5, 1]

// MAINTENANCE OPERATIONS
const M_START = new Date(MAINTENANCE_START).getTime()
const M_TIME = (MAINTENANCE_TIME || 30) * 60 * 1000

if(!MAINTENANCE || process.env.NODE_ENV !== 'production'){
  module.exports.evaluateMaintenance = _.noop
  module.exports.underMaintenance = () => false
}else{
  const evaluateMaintenance = (action, first=true) => {
    const far_out = (Date.now() - M_START)
    if(far_out > 0 && (far_out < M_TIME)){
      action(null)
    }else if(far_out < 0){
      var i, wait_time = far_out
      for(i = 0; i < WARNING_INTERVALS.length; i++){
        const interval = WARNING_INTERVALS[i] * 60 * 1000
        if((far_out * -1) > interval){
          wait_time = (far_out * -1) - interval
          break
        }
      }
      if(i > 0 && !first){
        action(moment(MAINTENANCE_START).fromNow(true))
      }
      if(i === WARNING_INTERVALS.length){
        wait_time = (far_out * -1)
      }
      setTimeout(()=>evaluateMaintenance(action, false), wait_time + 1000)
    }
  }

  module.exports.underMaintenance = (delay=10000) => {
    const far_out = (Date.now() - M_START)
    return (far_out > delay && (far_out < M_TIME))
  }
  module.exports.evaluateMaintenance = evaluateMaintenance
}

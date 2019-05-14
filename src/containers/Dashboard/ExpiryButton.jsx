import React from 'react'
import { Tooltip } from "react-tippy";
import moment from 'moment'

export default ({team, upgrade}) => {
  if(!team.expiry || team.state === 'EXPIRED') return null

  const days = moment(team.expiry).diff(moment(), 'days')

  return <div id="expiry-button" onClick={upgrade}>
    <Tooltip title={`Your trial ends in ${days} days`} distance={14}>
      <button>
        {days}
      </button>
    </Tooltip>
    <div style={{padding: '13px 0 13px 13px', fontSize: 13, fontWeight: 600}}>UPGRADE</div>
  </div>
}

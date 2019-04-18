import React from 'react'
import { Tooltip } from "react-tippy";

export const User = (props) => {
  if(!props.user.image) return null
  
  const style = {}
  var letter = null
  if(props.user.image.length === 13 && props.user.image.includes('|')){
    let colors = props.user.image.split('|')
    style.backgroundColor = '#' + colors[1]
    style.color = '#' + colors[0]
    letter = props.user.name[0]
  }else{
    style.backgroundImage = `url(${props.user.image})`
  }

  return <div className={["member-icon", props.className].join(" ")} style={style}>
    <span className="no-select">{letter}</span>
  </div>
}

export const Members = (props) => {
  const members = props.members.filter(m => !!m.email)
  const accepted = members.filter(m => !!m.creator_id)
  if(!accepted || accepted.length === 0){
    return null
  }

  if(members.length === 1){
    return <div style={{color: '#CDAD32'}} className="mr-4 pointer" onClick={() => props.update("MEMBERS")}>
      <img src="/images/icons/power.svg" alt="power"/>&nbsp;&nbsp;&nbsp;Add Collaborators
    </div>
  }

  return <div className="mr-3 super-center">
    <div className="d-flex flex-row-reverse">
      {accepted.slice(0, 8).map(m => {
        return <Tooltip
          key={m.creator_id}
          title={m.name}
          position="bottom"
        >
          <User user={m}/>
        </Tooltip>
      })}
    </div>
    {accepted.length > 8 && <div className="ml-3 text-muted">+{accepted.length - 8}</div>}
  </div>
}
import React from 'react'
import { Tooltip } from "react-tippy";

export const User = (props) => {
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

  return <div className={["member-icon no-select", props.className].join(" ")} style={style}>
    {letter}
  </div>
}

export const Members = (props) => {
  if(!props.members || props.members.length === 0){
    return null
  }

  return <div className="mr-3 super-center">
    <div className="d-flex flex-row-reverse">
      {props.members.slice(0, 8).map(m => {
        return <Tooltip
          key={m.creator_id}
          title={m.name}
          position="bottom"
        >
          <User user={m}/>
        </Tooltip>
      })}
    </div>
    {props.members.length > 8 && <div className="ml-3 text-muted">+{props.members.length - 8}</div>}
  </div>
}
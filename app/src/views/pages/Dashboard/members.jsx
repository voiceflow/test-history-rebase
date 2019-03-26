import React from 'react'

const Members = (props) => {
  if(!props.members || props.members.length === 0){
    return null
  }

  return <div className="mr-3 super-center">
    <div className="d-flex flex-row-reverse mr-3">
      {props.members.map(m => {
        const style = {}
        var letter = null
        if(m.image.length === 13 && m.image.includes('|')){
          let colors = m.image.split('|')
          style.backgroundColor = '#' + colors[1]
          style.color = '#' + colors[0]
          letter = m.name[0]
        }
        return <div className="member-icon" key={m.creator_id} style={style}>
          {letter}
        </div>
      })}
    </div>
    <span className="text-muted">+{props.members.length}</span>
  </div>
}

export default Members
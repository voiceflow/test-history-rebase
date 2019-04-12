import React from 'react'

export default (props) => {
  const option_map =props.options.map(o => o.type)

  return <>
    <p className="text-muted text-center mb-5 mt-4">{props.question}</p>
    <div className="row justify-content-center mb-3">
      {props.options.map(o => (
        <div className="col-s ml-4 mr-4" key={o.type}>
          <button className="void-button mb-2" onClick={()=>props.update(o.type)}>
            <img className="image-selector" alt="intermediate" src={props.state === o.type ? o.selected : o.unselected}/>
          </button>
          <p className={props.state === o.type ? "" : "text-muted"}>{o.text}</p>
        </div>
      ))}
    </div>
    <div className="justify-content-center">
      <button 
        className={"btn-primary" + (!(option_map.includes(props.state)) ? ' disabled': '')} 
        disabled={!(option_map.includes(props.state))} 
        onClick={props.next}>
        { props.button || "Continue" }
      </button>
    </div>
  </>
}
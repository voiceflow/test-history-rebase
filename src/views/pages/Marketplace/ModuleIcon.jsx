import React, { Component } from 'react'

function withRenderIcon(WrappedComponent) {
  return class extends React.Component {
    constructor(props){
      super(props)
      this.renderIcon = this.renderIcon.bind(this)
    }

    renderIcon(){
      let name = this.props.module.title.match(/\b(\w)/g)
      if(name) { name = name.join('') }
      else { name = this.props.module.title }
      name = name.substring(0,3)
      
      let module_colors = this.props.module.color.split('|')
      if(module_colors.length === 1){
          module_colors = ['F86683', 'FEF2F4']
      }
    
      let icon_style = {
          backgroundColor: `#${module_colors[1]}`,
          color: `#${module_colors[0]}`
      }
      
      return <div className="module-card-icon"><div className="no-image module-image" style={icon_style}><h1>{name}</h1></div></div>
    }

    render(){
      return <WrappedComponent {...this.props} />
    }
  }
}


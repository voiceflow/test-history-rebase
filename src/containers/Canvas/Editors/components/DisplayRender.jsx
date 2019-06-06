import React, { Component } from 'react'
import {DeviceConfig, createRenderer, devices} from '@voiceflow/apl-renderer'

import _ from 'lodash'

import './DisplayRender.css'

class DisplayRender extends Component {
    constructor(props){
        super(props)
        this.state = {
          device: "medHub",
          height: 450,
          scale: "scale(0.75)"
        }
        this.elem = React.createRef();
        this.device = new DeviceConfig(devices["medHub"]);
        this.changeDevice = this.changeDevice.bind(this);
    }

    async componentDidMount() {
      this.renderer = createRenderer(this.device, this.elem.current)
      try{
        await this.renderer.render(JSON.parse(this.props.apl),JSON.parse(this.props.data),{})
      }catch(e){
        this.props.error("Invalid APL or datasource")
      }
    }

    async changeDevice(device) {
      this.device = new DeviceConfig(devices[device]);
      this.renderer.setDeviceConfiguration(this.device)
      try{
        await this.renderer.render(JSON.parse(this.props.apl),JSON.parse(this.props.data),{})
      }catch(e){
        this.props.error("Invalid APL or datasource")
      }
      const scale = Math.min(768/this.device.getDpWidth(),1);
      this.setState({height:this.device.getDpHeight()*scale, scale:`scale(${scale})`, device});
    }

    render() {
        return (
              <div>
                <div style={{height:this.state.height+"px"}}>
                  <div className="display-elem" ref={this.elem} style={{transform:this.state.scale}}/>
                </div>
                <div className="d-flex justify-content-center pt-1">
                  { _.values(devices).map(d=>{
                    return (<div className={d.id===this.state.device?'svg-active':''} dangerouslySetInnerHTML={{__html:d.svgIcon}} key={d.id} onClick={()=>this.changeDevice(d.id)}/>)
                  }) }
                </div>
              </div>
        );
    }
}

export default DisplayRender;

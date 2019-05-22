import _ from "lodash";
import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'

 import Conditions from './Test/conditions'
import Timeline from './Test/timeline'

 class Test extends Component {
  constructor(props) {
    super(props)

     this.state = {}
  }

   render() {
    return (
      <div id="TestSidebar" className={cn({
        open: this.props.open
      })}>
        <Conditions />
        <Timeline />

     </div>
    )
  }
}

 const mapStateToProps = state => ({});
export default compose(
  connect(mapStateToProps)
)(Test);
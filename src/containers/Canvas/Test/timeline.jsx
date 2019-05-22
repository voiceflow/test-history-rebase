import _ from "lodash";
import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'

 class Timeline extends Component {
  constructor(props) {
    super(props)

     this.state = {}
  }

   render() {
    return (
      <div id='Timeline' className={cn({

       })}>
        Timeline
    </div>
    )
  }
}

 const mapStateToProps = state => ({});
export default compose(
  connect(mapStateToProps)
)(Timeline);
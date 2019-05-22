import _ from "lodash";
import React, { Component } from "react";
import { compose } from "recompose";
import { connect } from "react-redux";
import cn from 'classnames'

 class Conditions extends Component {
  constructor(props) {
    super(props)

     this.state = {}
  }

   render() {
    return (
      <div id='Conditions' className={cn({

       })}>
        conditions
    </div>
    )
  }
}

 const mapStateToProps = state => ({});
export default compose(
  connect(mapStateToProps)
)(Conditions);
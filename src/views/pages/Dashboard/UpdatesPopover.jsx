/* eslint react/no-multi-comp: 0, react/prop-types: 0 */
import React from 'react'
import moment from 'moment'

const class_mapping = {
  FEATURE: {
    class: 'update-modal-feature',
    label: 'New Feature'
  },
  UPDATE: {
    class: 'update-modal-update',
    label: 'Update'
  },
  CHANGE: {
    class: 'update-modal-change',
    label: 'Change'
  }
}

class UpdatesPopover extends React.Component {

  render() {
    console.log(this.props.product_updates)
    return (
      <div className="text-center pt-1 pb-1">
        {Array.isArray(this.props.product_updates) && this.props.product_updates.map((entry, i) => {
          return <React.Fragment key={i}>
            <div align="left" className="pr-1 pl-1">
              <p className={"d-inline-block mb-0 " + class_mapping[entry.type].class}>&bull; {class_mapping[entry.type].label}: </p>
              <p className="d-inline-block mb-1" dangerouslySetInnerHTML={{ __html: entry.details }}></p>
              <p className="text-secondary mb-0">{moment(entry.created).fromNow()}</p>
            </div>
            {i !== this.props.product_updates.length - 1 && <hr className="w-100"/>}
          </React.Fragment>
        })}
      </div>
    )
  }
}

export default UpdatesPopover
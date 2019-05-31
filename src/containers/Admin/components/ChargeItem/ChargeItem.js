import React from 'react';

import './ChargeItem.css';
import moment from "moment";

const ChargeItem = (props) => {
  if (props.charge) {
    console.log('charge: ', props.charge);
    const {charge} = props;
    return (
      <tr>
        <td>{charge.id}</td>
        <td>{charge.customer}</td>
        <td>{charge.amount * 1.0 / 100} {charge.currency.toUpperCase()}</td>
        <td>{charge.amount_refunded * 1.0 / 100} {charge.currency.toUpperCase()}</td>
        <td>{moment(charge.created).format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td>{charge.description}</td>
        <td>
          <div>
            <a href={charge.receipt_url} target="_blank" className="ci__view_link">View Charge <i className="fas fa-external-link"/></a>
          </div>
          <hr className="ci__link_breaker"/>
          <div>
            <span className="ci__refund_link" onClick={() => props.showModal(charge)}>Refund</span>
          </div>
        </td>
      </tr>
    )
  } else {
    return null;
  }
};

export default ChargeItem;

import './ChargeItem.css';

import moment from 'moment';
import React from 'react';

const ChargeItem = (props) => {
  if (props.charge) {
    const { charge } = props;
    return (
      <tr>
        <td>{charge.id}</td>
        <td>{charge.customer}</td>
        <td>
          {(charge.amount * 1.0) / 100} {charge.currency.toUpperCase()}
        </td>
        <td>
          {(charge.amount_refunded * 1.0) / 100} {charge.currency.toUpperCase()}
        </td>
        <td>{moment(charge.created).format('MMMM Do YYYY, h:mm:ss a')}</td>
        <td>{charge.description}</td>
        <td>
          <div>
            <a href={charge.receipt_url} target="_blank" rel="noopener noreferrer" className="ci__view_link">
              View Charge <i className="fas fa-external-link" />
            </a>
          </div>
          <hr className="ci__link_breaker" />
          {charge.amount !== charge.amount_refunded ? (
            <div>
              <span className="ci__refund_link" onClick={() => props.showModal(charge)}>
                Refund
              </span>
            </div>
          ) : (
            <div>
              <span className="ci__refunded">Refunded</span>
            </div>
          )}
        </td>
      </tr>
    );
  }
  return null;
};

export default ChargeItem;

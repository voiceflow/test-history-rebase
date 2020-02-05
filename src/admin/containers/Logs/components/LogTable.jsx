import moment from 'moment';
import React from 'react';
import ReactJson from 'react-json-view';
import { Table } from 'reactstrap';

import TablePagination from './TablePagination';

class LogTable extends React.PureComponent {
  state = {
    page: 0,
    rowsPerPage: 10,
  };

  handleChangePage = (event, page) => this.setState({ page });

  handleChangeRowsPerPage = (event) => this.setState({ rowsPerPage: event.target.value });

  render() {
    const { logs } = this.props;
    const { rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, logs.length - page * rowsPerPage);

    return (
      <Table>
        <colgroup>
          <col style={{ width: '10%' }} />
          <col style={{ width: '10%' }} />
          <col style={{ width: '40%' }} />
          <col style={{ width: '40%' }} />
        </colgroup>
        <thead>
          <tr>
            <th>Timestamp</th>
            <th>User</th>
            <th>Errors</th>
            <th>Request</th>
          </tr>
        </thead>
        <tbody>
          {logs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log, i) => (
            <tr key={i + page * rowsPerPage}>
              <td>{moment(log.timestamp).format('LLL')}</td>
              <td>{log.user_id.slice(0, 11)}</td>
              {parseRequest(log.request)}
            </tr>
          ))}
          {emptyRows > 0 && (
            <tr style={{ height: 48 * emptyRows }}>
              <td colSpan={6} />
            </tr>
          )}
        </tbody>
        <tfoot>
          <tr>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              count={logs.length}
              colSpan={3}
              rowsPerPage={rowsPerPage}
              page={page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
          </tr>
        </tfoot>
      </Table>
    );
  }
}

export default LogTable;

function parseRequest(rawRequest) {
  const request = JSON.parse(rawRequest);

  return (
    <>
      <td>
        <p className="mb-0 text-danger">{request.error.type}</p>
        <p className="mt-0">{request.error.message}</p>
      </td>
      <td>
        <ReactJson collapsed src={request} enableClipboard={false} collapseStringsAfterLength={40} />
      </td>
    </>
  );
}

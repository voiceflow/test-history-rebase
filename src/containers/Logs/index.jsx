import axios from 'axios';
import moment from 'moment';
// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import ReactJson from 'react-json-view';
import { connect } from 'react-redux';
import { Table } from 'reactstrap';

import Button from '@/components/Button';

class TablePagination extends React.Component {
  handleFirstPageButtonClick = (event) => {
    const { onChangePage } = this.props;
    onChangePage(event, 0);
  };

  handleBackButtonClick = (event) => {
    const { onChangePage, page } = this.props;
    onChangePage(event, page - 1);
  };

  handleNextButtonClick = (event) => {
    const { onChangePage, page } = this.props;
    onChangePage(event, page + 1);
  };

  handleLastPageButtonClick = (event) => {
    const { onChangePage, count, rowsPerPage } = this.props;
    onChangePage(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  render() {
    const { count, page, rowsPerPage } = this.props;

    return (
      <div>
        <Button isBtn isClear onClick={this.handleFirstPageButtonClick} disabled={page === 0} aria-label="First Page">
          <i className="fas fa-step-forward" />
          />
        </Button>
        <Button isBtn isClear onClick={this.handleBackButtonClick} disabled={page === 0} aria-label="Previous Page">
          <i className="fas fa-chevron-left" />
        </Button>
        <Button isBtn isClear onClick={this.handleNextButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Next Page">
          <i className="fas fa-chevron-right" />
        </Button>
        <Button isBtn isClear onClick={this.handleLastPageButtonClick} disabled={page >= Math.ceil(count / rowsPerPage) - 1} aria-label="Last Page">
          <i className="fas fa-step-backward" />
        </Button>
      </div>
    );
  }
}

TablePagination.propTypes = {
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
};

export class LogTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rows_per_page: 10,
    };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = (event) => {
    this.setState({ rows_per_page: event.target.value });
  };

  render() {
    const { rows_per_page, page } = this.state;
    const { logs } = this.props;
    const empty_rows = rows_per_page - Math.min(rows_per_page, logs.length - page * rows_per_page);
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
          {logs.slice(page * rows_per_page, page * rows_per_page + rows_per_page).map((log, i) => (
            <tr key={i + page * rows_per_page}>
              <td>{moment(log.timestamp).format('LLL')}</td>
              <td>{log.user_id.slice(0, 11)}</td>
              {parseRequest(log.request)}
            </tr>
          ))}
          {empty_rows > 0 && (
            <tr style={{ height: 48 * empty_rows }}>
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
              rowsPerPage={rows_per_page}
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

class Logs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // endpoint: socket_endpoint,
      response: '',
      logs: [],
      name: '',
    };

    this.onLoad = this.onLoad.bind(this);
  }

  onLoad() {
    const { skill_id } = this.props;
    axios
      .get(`/logs/${skill_id}`)
      .then((res) => {
        this.setState({
          logs: res.data,
        });
      })
      .catch((err) => {
        this.setState({
          error: err,
        });
      });
  }

  componentDidMount() {
    this.onLoad();
  }

  render() {
    const { logs } = this.state;
    const { name } = this.props;
    return (
      <div className="px-5 justify-content-start">
        <h5 className="pt-4">
          <b>{name}</b> Error Logs
        </h5>
        <hr />
        {logs.length > 0 ? (
          <LogTable logs={logs} />
        ) : (
          <div className="alert alert-primary" role="alert">
            Your skill hasn't encountered any errors yet
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  skill_id: state.skills.skill.skill_id,
  name: state.skills.skill.name,
});

export default connect(mapStateToProps)(Logs);

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

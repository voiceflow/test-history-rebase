import cn from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Table } from 'reactstrap'
// import io from 'socket.io-client'
import axios from "axios";
import moment from "moment";
import ReactJson from "react-json-view";
import PropTypes from "prop-types";

import Button from 'components/Button'

class TablePagination extends React.Component {
  handleFirstPageButtonClick = event => {
    this.props.onChangePage(event, 0);
  };

  handleBackButtonClick = event => {
    this.props.onChangePage(event, this.props.page - 1);
  };

  handleNextButtonClick = event => {
    this.props.onChangePage(event, this.props.page + 1);
  };

  handleLastPageButtonClick = event => {
    this.props.onChangePage(
      event,
      Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1)
    );
  };

  render() {
    const { count, page, rowsPerPage, theme } = this.props;

    return (
      <div>
        <Button
          isBtn
          isClear
          onClick={this.handleFirstPageButtonClick}
          disabled={page === 0}
          aria-label="First Page"
        >
          <i
            className={cn("fas", {
              "fa-step-forward": theme.direction === "rtl",
              "fa-step-backward": theme.direction !== "rtl"
            })}
          />
        </Button>
        <Button
          isBtn
          isClear
          onClick={this.handleBackButtonClick}
          disabled={page === 0}
          aria-label="Previous Page"
        >
          <i
            className={cn("fas", {
              "fa-chevron-right": theme.direction === "rtl",
              "fa-chevron-left": theme.direction !== "rtl"
            })}
          />
        </Button>
        <Button
          isBtn
          isClear
          onClick={this.handleNextButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Next Page"
        >
          <i
            className={cn("fas", {
              "fa-chevron-right": theme.direction !== "rtl",
              "fa-chevron-left": theme.direction === "rtl"
            })}
          />
        </Button>
        <Button
          isBtn
          isClear
          onClick={this.handleLastPageButtonClick}
          disabled={page >= Math.ceil(count / rowsPerPage) - 1}
          aria-label="Last Page"
        >
          <i
            className={cn("fas", {
              "fa-step-forward": theme.direction !== "rtl",
              "fa-step-backward": theme.direction === "rtl"
            })}
          />
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
  theme: PropTypes.object.isRequired
};

export class LogTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      rows_per_page: 10
    };

    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
    this.parseRequest = this.parseRequest.bind(this);
  }

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rows_per_page: event.target.value });
  };

  parseRequest(request) {
    request = JSON.parse(request);

    return (
      <React.Fragment>
        <td>
          <p className="mb-0 text-danger">{request.error.type}</p>
          <p className="mt-0">{request.error.message}</p>
        </td>
        <td>
          <ReactJson
            collapsed
            src={request}
            enableClipboard={false}
            collapseStringsAfterLength={40}
          />
        </td>
      </React.Fragment>
    );
  }

  render() {
    const empty_rows = this.state.rows_per_page - Math.min(
      this.state.rows_per_page,
      this.props.logs.length - this.state.page * this.state.rows_per_page
    );
    return (
      <Table>
        <colgroup>
          <col style={{ width: "10%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: "40%" }} />
          <col style={{ width: "40%" }} />
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
          {this.props.logs
            .slice(
              this.state.page * this.state.rows_per_page,
              this.state.page * this.state.rows_per_page +
                this.state.rows_per_page
            )
            .map((log, i) => (
              <tr key={i + this.state.page * this.state.rows_per_page}>
                <td>{moment(log.timestamp).format("LTS")}</td>
                <td>{log.user_id.slice(0, 11)}</td>
                {this.parseRequest(log.request)}
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
              count={this.props.logs.length}
              colSpan={3}
              rowsPerPage={this.state.rows_per_page}
              page={this.state.page}
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
      response: "",
      logs: [],
      name: ""
    };

    this.onLoad = this.onLoad.bind(this);
  }

  onLoad() {
    axios
      .get(`/logs/${this.props.skill_id}`)
      .then(res => {
        this.setState({
          logs: res.data
        });
      })
      .catch(err => {
        this.setState({
          error: err
        });
      });
  }

  componentDidMount() {
    this.onLoad();
  }

  render() {
    return (
      <div className="px-5 justify-content-start">
        <h5 className="pt-4">
          <b>{this.props.name}</b> Error Logs
        </h5>
        <hr />
        {this.state.logs.length > 0 ? (
          <LogTable logs={this.state.logs} />
        ) : (
          <div className="alert alert-primary" role="alert">
            Your skill hasn't encountered any errors yet
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  skill_id: state.skills.skill.skill_id,
  name: state.skills.skill.name
});

export default connect(mapStateToProps)(Logs);

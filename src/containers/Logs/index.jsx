import cn from "classnames";
import React, { Component } from "react";
import { connect } from "react-redux";
// import io from 'socket.io-client'
import axios from "axios/index";
import moment from "moment/moment";
import ReactJson from "react-json-view";
import Table from "@material-ui/core/Table/index";
import TableBody from "@material-ui/core/TableBody/index";
import TableCell from "@material-ui/core/TableCell/index";
import TableHead from "@material-ui/core/TableHead/index";
import TableFooter from "@material-ui/core/TableFooter/index";
import TableRow from "@material-ui/core/TableRow/index";
import TablePagination from "@material-ui/core/TablePagination/index";
import IconButton from "@material-ui/core/IconButton/index";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles/index";

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5
  }
});

class TablePaginationActions extends React.Component {
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
    const { classes, count, page, rowsPerPage, theme } = this.props;

    return (
      <div className={classes.root}>
        <IconButton
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
        </IconButton>
        <IconButton
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
        </IconButton>
        <IconButton
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
        </IconButton>
        <IconButton
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
        </IconButton>
      </div>
    );
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired
};

const TablePaginationActionsWrapped = withStyles(actionsStyles, {
  withTheme: true
})(TablePaginationActions);

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
        <TableCell>
          <p className="mb-0 text-danger">{request.error.type}</p>
          <p className="mt-0">{request.error.message}</p>
        </TableCell>
        <TableCell>
          <ReactJson
            collapsed
            src={request}
            enableClipboard={false}
            collapseStringsAfterLength={40}
          />
        </TableCell>
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
        <TableHead>
          <TableRow>
            <TableCell>Timestamp</TableCell>
            <TableCell>User</TableCell>
            <TableCell>Errors</TableCell>
            <TableCell>Request</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.props.logs
            .slice(
              this.state.page * this.state.rows_per_page,
              this.state.page * this.state.rows_per_page +
                this.state.rows_per_page
            )
            .map((log, i) => (
              <TableRow key={i + this.state.page * this.state.rows_per_page}>
                <TableCell>{moment(log.timestamp).format("LTS")}</TableCell>
                <TableCell>{log.user_id.slice(0, 11)}</TableCell>
                {this.parseRequest(log.request)}
              </TableRow>
            ))}
          {empty_rows > 0 && (
            <TableRow style={{ height: 48 * empty_rows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 15]}
              count={this.props.logs.length}
              colSpan={3}
              rowsPerPage={this.state.rows_per_page}
              page={this.state.page}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              ActionsComponent={TablePaginationActionsWrapped}
            />
          </TableRow>
        </TableFooter>
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

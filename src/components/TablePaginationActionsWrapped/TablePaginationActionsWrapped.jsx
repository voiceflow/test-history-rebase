import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const actionsStyles = theme => ({
  root: {
    flexShrink: 0,
    color: theme.palette.text.secondary,
    marginLeft: theme.spacing.unit * 2.5,
  },
})

class TablePaginationActions extends React.Component {
  handleFirstPageButtonClick = event => {
      this.props.onChangePage(event, 0);
  }

  handleBackButtonClick = event => {
      this.props.onChangePage(event, this.props.page - 1);
  }

  handleNextButtonClick = event => {
      this.props.onChangePage(event, this.props.page + 1);
  }

  handleLastPageButtonClick = event => {
      this.props.onChangePage(
          event,
          Math.max(0, Math.ceil(this.props.count / this.props.rowsPerPage) - 1),
      )
  }

  render() {
      const { classes, count, page, rowsPerPage, theme } = this.props;

      return (
          <div className={classes.root}>
          <IconButton
              onClick={this.handleFirstPageButtonClick}
              disabled={page === 0}
              aria-label="First Page"
          >
              {theme.direction === 'rtl' ? <i className="fas fa-step-forward"/> : <i className="fas fa-step-backward"/>}
          </IconButton>
          <IconButton
              onClick={this.handleBackButtonClick}
              disabled={page === 0}
              aria-label="Previous Page"
          >
              {theme.direction === 'rtl' ? <i className="fas fa-chevron-right"/> : <i className="fas fa-chevron-left"/>}
          </IconButton>
          <IconButton
              onClick={this.handleNextButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="Next Page"
          >
              {theme.direction === 'rtl' ? <i className="fas fa-chevron-left"/> : <i className="fas fa-chevron-right"/>}
          </IconButton>
          <IconButton
              onClick={this.handleLastPageButtonClick}
              disabled={page >= Math.ceil(count / rowsPerPage) - 1}
              aria-label="Last Page"
          >
              {theme.direction === 'rtl' ? <i className="fas fa-step-backward"/> : <i className="fas fa-step-forward"/>}
          </IconButton>
          </div>
      )
  }
}

TablePaginationActions.propTypes = {
  classes: PropTypes.object.isRequired,
  count: PropTypes.number.isRequired,
  onChangePage: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
  theme: PropTypes.object.isRequired,
}

const TablePaginationActionsWrapped = withStyles(actionsStyles, { withTheme: true })(
  TablePaginationActions,
)

export default TablePaginationActionsWrapped
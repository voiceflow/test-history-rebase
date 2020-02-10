// eslint-disable-next-line import/no-extraneous-dependencies
import PropTypes from 'prop-types';
import React from 'react';

import Button from '@/components/LegacyButton';

class TablePagination extends React.PureComponent {
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

export default TablePagination;

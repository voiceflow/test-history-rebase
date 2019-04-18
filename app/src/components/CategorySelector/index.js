import React, { Component } from 'react';
import memoize from 'memoize-one';
import PropTypes from 'prop-types';

import { CATEGORIES, CATEGORIES_OPTIONS } from 'constants/categories';

import Icon from '../Icon';
import Modal from '../Modal';
import Input from '../Input';
import Autocomplete from '../Autocomplete';

import { FIRST_COLUMN_IDS, SECOND_COLUMN_IDS, THIRD_COLUMN_IDS } from './lib/data';

import CategoriesList from './components/CategoriesList';

export default class CategorySelector extends Component {
  static propTypes = {
    value: PropTypes.string,
    error: PropTypes.string,
    onSelect: PropTypes.func.isRequired,
  };

  static getCategoryOnReview(catId) {
    const category = CATEGORIES.find(
      ({ id, children }) => id === catId || (children && children.some(({ id }) => id === catId))
    );
    const isSecondLevel = category.id !== catId;

    return (
      <span className="sl-icon-group">
        <span className="sl-icon-group__icon">
          <Icon className={category.icon} />
        </span>

        <span className="sl-icon-group__label">
          {isSecondLevel ? <span className="text-gray">{category.label} - </span> : category.label}
          {isSecondLevel && category.children.find(({ id }) => id === catId).label}
        </span>
      </span>
    );
  }

  static filterOptions(filteredOptions, columnIds) {
    return CATEGORIES_OPTIONS.filter(
      ({ id, label }) =>
        columnIds.includes(id) &&
        filteredOptions.find(o => (o.id === id && !o.disabled) || o.preLevelLabel === label)
    );
  }

  state = {
    filteredLabel: '',
  };

  getFirstColumnItems = memoize(filteredOptions =>
    CategorySelector.filterOptions(filteredOptions, FIRST_COLUMN_IDS)
  );

  getSecondColumnItems = memoize(filteredOptions =>
    CategorySelector.filterOptions(filteredOptions, SECOND_COLUMN_IDS)
  );

  getThirdColumnItems = memoize(filteredOptions =>
    CategorySelector.filterOptions(filteredOptions, THIRD_COLUMN_IDS)
  );

  onClear = () => {
    this.setState({ filteredLabel: '' });
  };

  onChangeSearch = ({ target }) => {
    this.setState({ filteredLabel: target.value });
  };

  renderHeader = () => {
    return <h2 className="modal-title">Select skill category</h2>;
  };

  renderBody = ({ onSelect, filteredOptions }) => {
    const { filteredLabel } = this.state;

    return (
      <div className="skill-categories">
        <div className="skill-categories__search">
          <div className="form-control-group">
            <Input
              icon="search"
              value={filteredLabel}
              action={filteredLabel ? 'close-regular' : null}
              onChange={this.onChangeSearch}
              autoFocus
              placeholder="Search categories"
              onActionClick={this.onClear}
            />
          </div>
        </div>

        <div className="skill-categories-lists">
          <div className="skill-categories-lists__col">
            <CategoriesList
              items={this.getFirstColumnItems(filteredOptions)}
              onItemClick={onSelect}
            />
          </div>
          <div className="skill-categories-lists__col">
            <CategoriesList
              items={this.getSecondColumnItems(filteredOptions)}
              onItemClick={onSelect}
            />
          </div>
          <div className="skill-categories-lists__col">
            <CategoriesList
              items={this.getThirdColumnItems(filteredOptions)}
              onItemClick={onSelect}
            />
          </div>
        </div>
      </div>
    );
  };

  renderPopover = ({ show, onHide, onSelect, filteredOptions }) => {
    return (
      <Modal
        show={show}
        onHide={onHide}
        renderBody={() => this.renderBody({ onSelect, filteredOptions })}
        renderHeader={this.renderHeader}
        isFullscreen
        enableScrollbarOffset
        updateScrollbarOffsetOnUpdate
      />
    );
  };

  render() {
    const { filteredLabel } = this.state;
    const { error, value, onSelect } = this.props;

    return (
      <div className="form-group __is-category-selector">
        <Autocomplete
          value={value}
          error={error}
          label="Category"
          options={CATEGORIES_OPTIONS}
          onSelect={onSelect}
          autoFocus={false}
          rightAddon={<Icon className="grid" />}
          blurOnHide
          placeholder="Select a category of you skill"
          filteredLabel={filteredLabel}
          disableSorting
          popoverRenderer={this.renderPopover}
          withCustomInput
          rightAddonClassName="__with-action h-pe-n"
        />
      </div>
    );
  }
}

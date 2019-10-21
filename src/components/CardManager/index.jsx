import cuid from 'cuid';
import React from 'react';
import { Input } from 'reactstrap';

import Button from '@/componentsV2/Button';
import { createNextName } from '@/utils/string';

import { CardManagerItem } from './components';

const SEARCH_MIN_COUNT = 4;
const DEFAULT_MAX_COUNT = 251;

class CardManager extends React.PureComponent {
  state = {
    searchValue: '',
  };

  onAdd = () => {
    const id = cuid.slug();
    const name = createNextName(this.props.type, this.props.items);

    this.props.onAdd(id, name);
    this.setState({ searchValue: '' });
  };

  onRemove = (id) => () => this.props.onRemove(id);

  onUpdate = (id) => (slot) => this.props.onUpdate(id, slot, true);

  onSearchChange = ({ target }) => this.setState({ searchValue: target.value.toLowerCase() });

  nameExists = (name) => this.props.items.some((item) => item.name === name);

  render() {
    const { label, addLabel, searchPlaceholder, max, formComponent: FormComponent, items, live_mode } = this.props;
    const { searchValue } = this.state;
    const totalItems = items.length;
    const listItems = items
      .filter((item) => item.name.includes(searchValue))
      .map((item) => (
        <CardManagerItem key={item.id}>
          <FormComponent value={item} nameExists={this.nameExists} onUpdate={this.onUpdate(item.id)} onRemove={this.onRemove(item.id)} />
        </CardManagerItem>
      ))
      .reverse();

    return (
      <>
        <label>{label}</label>
        <div className="w-100">
          {totalItems > SEARCH_MIN_COUNT && (
            <Input
              type="search"
              onChange={this.onSearchChange}
              id="searchItems"
              placeholder={searchPlaceholder}
              className="mb-3 form-control-border search-input"
              value={searchValue}
            />
          )}
        </div>
        {totalItems < max && (
          <Button fullWidth variant="secondary" icon="plus" onClick={this.onAdd} disabled={live_mode}>
            {addLabel}
          </Button>
        )}
        {listItems}
      </>
    );
  }
}

CardManager.defaultProps = {
  max: DEFAULT_MAX_COUNT,
};

export default CardManager;

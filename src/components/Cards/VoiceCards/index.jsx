import cn from 'classnames';
import React, { Component } from 'react';
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

import { stopPropagation } from '@/utils/dom';

class VoiceCards extends Component {
  state = {
    dropdownOpen: false,
  };

  onMouseEnter = () => this.setState({ dropdownOpen: true });

  onMouseLeave = () => this.setState({ dropdownOpen: false });

  toggleDropdown = () => this.setState({ dropdownOpen: !this.state.dropdownOpen });

  render() {
    const { dropdownOpen } = this.state;

    return (
      <div className="product-card">
        <Card onClick={this.props.onClick}>
          <div className="product-image" style={this.props.icon ? { backgroundImage: `url(${this.props.icon})` } : {}}>
            <div className="overlay">
              {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
              <div className={cn('elispie', { open: dropdownOpen })} onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Dropdown isOpen={dropdownOpen} direction="down" toggle={this.toggleDropdown}>
                  <DropdownToggle tag="div" className="elispie-button">
                    <i className="far fa-ellipsis-h" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {this.props.copyLabel && <DropdownItem onClick={stopPropagation(this.props.onCopy)}>{this.props.copyLabel}</DropdownItem>}
                    <DropdownItem onClick={stopPropagation(this.props.onDelete)}>{this.props.deleteLabel}</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </div>
              <div className="edit-button" style={{ color: '#fff' }}>
                {this.props.buttonLabel}
              </div>
            </div>
            {!this.props.icon && this.props.placeholder}
          </div>
          <CardBody>
            <div className="product-body">
              <p className="product-title mb-1">{this.props.name}</p>
              {!!this.props.desc && (
                <p className="product-desc">
                  {this.props.desc}
                  &nbsp;
                  <span className="product-price">{this.props.secondaryDesc}</span>
                </p>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default VoiceCards;

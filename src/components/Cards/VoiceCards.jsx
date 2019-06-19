import cn from 'classnames';
import _ from 'lodash';
import React, { Component } from 'react';
import { Card, CardBody, Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';

class VoiceCards extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  toggleDropDown() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onMouseEnter() {
    this.setState({
      dropdownOpen: true,
    });
  }

  onMouseLeave() {
    this.setState({
      dropdownOpen: false,
    });
  }

  render() {
    return (
      <div key={this.props.id} className="product-card">
        <Card
          key={this.props.id}
          onClick={() => {
            !_.isNull(this.props.extension) ? this.props.onClick(this.props.id, this.props.extension) : this.props.onClick(this.props.id);
          }}
        >
          <div className="product-image" style={this.props.icon ? { backgroundImage: `url(${this.props.icon})` } : {}}>
            <div className="overlay">
              {/* eslint-disable-next-line jsx-a11y/mouse-events-have-key-events */}
              <div className={cn('elispie', { open: this.state.dropdownOpen })} onMouseOver={this.onMouseEnter} onMouseLeave={this.onMouseLeave}>
                <Dropdown isOpen={this.state.dropdownOpen} direction="down" toggle={() => this.setState({ dropdownOpen: !this.state.dropdownOpen })}>
                  <DropdownToggle tag="div" className="elispie-button">
                    <i className="far fa-ellipsis-h" />
                  </DropdownToggle>
                  <DropdownMenu right>
                    {this.props.copyLabel && (
                      <DropdownItem
                        onClick={(e) => {
                          e.stopPropagation();
                          this.props.onCopy(this.props.id);
                        }}
                      >
                        {this.props.copyLabel}
                      </DropdownItem>
                    )}
                    <DropdownItem
                      onClick={(e) => {
                        e.stopPropagation();
                        this.props.onDelete(this.props.id, this.props.name);
                      }}
                    >
                      {this.props.deleteLabel}
                    </DropdownItem>
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

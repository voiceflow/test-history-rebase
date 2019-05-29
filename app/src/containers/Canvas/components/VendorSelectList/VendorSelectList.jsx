import React, { Component } from 'react';
import { connect } from 'react-redux';
import cn from 'classnames';
import "./VendorSelectList.css";

import Button from 'components/Button';
import { updateVendorId } from 'ducks/project';

class VendorSelectList extends Component {
	componentDidMount = () => {
		document.addEventListener('mousedown', this.handleClickOutside);
	};

	componentWillUnmount = () => {
		document.removeEventListener('mousedown', this.handleClickOutside);
	};

	handleClickOutside = (event) => {
		if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
			this.props.onBlur();
		}
	};

	setWrapperRef = (node) => {
		this.wrapperRef = node;
	};

	renderVendorList = () => {
		return this.props.vendors.map(vendor => {
			return (
				<Button
					isActive={this.props.vendor_id === vendor.id}
					className={cn('country-checkbox', 'vendor-button')}
					key={vendor.id}
					onClick={() => {
						this.props.updateVendorId(this.props.project_id, vendor.id)
          }}>
					<span>{vendor.name}</span>
				</Button>
			);
		});
	};

	render() {

		return <div className={cn('vendors-select-list', {})} ref={this.setWrapperRef}>
			<div className="wh_select-list-header">
				SELECT VENDOR
			</div>
			{this.renderVendorList()}
		</div>;
	}
}

const mapStateToProps = state => ({
	vendor_id: state.skills.skill.vendor_id
});

export default connect(mapStateToProps, { updateVendorId })(VendorSelectList);

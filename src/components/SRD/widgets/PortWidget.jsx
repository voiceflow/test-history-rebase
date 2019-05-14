import React from "react";

import { BaseWidget } from "./BaseWidget";

export class PortWidget extends BaseWidget {
	constructor(props: PortProps) {
		super("srd-port", props);
		this.state = {
			selected: false
		};
	}

	getClassName() {
		return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "");
	}

	render() {
		return (
			<div
				{...this.getProps()}
				onMouseEnter={() => {
					this.setState({ selected: true });
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
				}}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}

import * as React from "react";
import { NodeModel, BaseWidget, BaseWidgetProps } from "storm-react-diagrams";

export interface PortProps extends BaseWidgetProps {
	name: string;
	node: NodeModel;
}

export interface PortState {
	selected: boolean;
}

/**
 * @author Dylan Vorster
 */
export class BlockPortWidget extends BaseWidget<PortProps, PortState> {
	constructor(props: PortProps) {
		super("srd-port", props);
		this.state = {
			selected: false
		};
	}

	getClassName() {
		return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "" + (this.props.link ? "used" : ""));
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

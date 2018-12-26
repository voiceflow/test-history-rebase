import _ from 'lodash';
import * as React from "react";
import { NodeModel, PortModel, BaseWidget, BaseWidgetProps } from "storm-react-diagrams";

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
			selected: false,
		};
		this.setLink = this.setLink.bind(this);
	}

	getClassName(){
		return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "" + (this.props.link ? "used" : ""));
	}

	setLink(isSelected = false){
		_.forEach(this.props.node.ports[this.props.name].links, (link) => {
			link.setSelected(isSelected);
		})
		this.props.diagramEngine.repaintCanvas();
	}

	render() {
		return (
			<div
				{...this.getProps()}
				onMouseEnter={() => {
					this.setState({ selected: true });
					this.setLink(true);
				}}
				onMouseLeave={() => {
					this.setState({ selected: false });
					this.setLink(false);
				}}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}

import * as React from "react";
import { BlockPortModel } from "../models/BlockPortModel";
import { BlockPortWidget } from "./BlockPortWidget";
import { BaseWidget, BaseWidgetProps } from "storm-react-diagrams";

export interface BlockPortLabelProps extends BaseWidgetProps {
	model: BlockPortModel;
}

export interface BlockPortLabelState {}

/**
 * @author Dylan Vorster
 */
export class BlockPortLabel extends BaseWidget<BlockPortLabelProps, BlockPortLabelState> {
	constructor(props) {
		super("srd-default-port", props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--out"));
	}

	render() {
		function isEmpty(obj) {
		    for (let x in obj) { return false; }
		    return true;
		}

		var port = <BlockPortWidget diagramEngine={this.props.diagramEngine} node={this.props.model.getParent()} name={this.props.model.name} link={isEmpty(this.props.model.links)}/>;
		var label = <div className="name">{this.props.model.label}</div>;

		return (
			<div {...this.getProps()}>
				{this.props.model.in ? port : label}
				{this.props.model.in ? label : port}
			</div>
		);
	}
}

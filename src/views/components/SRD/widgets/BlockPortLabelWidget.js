import * as React from "react";
import _ from 'lodash';
import { BlockPortWidget } from "./BlockPortWidget";
import { BaseWidget } from "./../main.js";

/**
 * @author Dylan Vorster
 */
const isEmpty = (obj) => {
	for (let x in obj) { return false; }
	return true;
}
export class BlockPortLabel extends BaseWidget {
	constructor(props) {
		super("srd-default-port", props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--out"));
	}

	render() {
		let node = this.props.model.getParent()

		var port = <BlockPortWidget
			diagramEngine={this.props.diagramEngine}
			isHidden = {
				!!((node.parentCombine && (!this.props.model.in && !this.props.isLast && !this.props.isMoving )))
			}
			port={this.props.model} node={node} name={this.props.model.name}
			link={isEmpty(this.props.model.links)}
			isMoving={this.props.isMoving}
		/>;
		var label
		if (!((node.parentCombine && (!this.props.isLast || node.isLast)) || (!_.isEmpty(node.combines)) || this.props.isMoving)){
			if(this.props.model.label.toString().trim()) label = <div className="name">{this.props.model.label}</div>
		}

		return (
			<div {...this.getProps()}>
				{this.props.model.in || (node.parentCombine && !this.props.isLast) ? port : label}
				{this.props.model.in || (node.parentCombine && !this.props.isLast) ? label : port}
			</div>
		);
	}
}

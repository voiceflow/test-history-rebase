import * as React from "react";
import _ from 'lodash';
import { BlockPortWidget } from "./BlockPortWidget";
import { BaseWidget } from "./../main.js";

/**
 * @author Dylan Vorster
 */
export class BlockPortLabel extends BaseWidget {
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

		var port = <BlockPortWidget
			diagramEngine={this.props.diagramEngine}
			isHidden = {
				!!(this.props.model.parent.parentCombine || (_.includes(this.props.model.parent.combines, 'temp') && !this.props.model.in))
			}
			port={this.props.model} node={this.props.model.getParent()} name={this.props.model.name}
			link={isEmpty(this.props.model.links)}
		/>;
		var label = <div className="name">{_.isEmpty(this.props.model.getParent().combines) && this.props.model.label}</div>;
		if ((this.props.model.getParent().parentCombine && (this.props.isLast || this.props.model.getParent().isLast)) || (!_.isEmpty(this.props.model.getParent().combines)) || this.props.isMoving){
			label = null;
		}
		return (
			<div {...this.getProps()}>
				{this.props.model.in || (this.props.model.getParent().parentCombine && !this.props.isLast) ? port : label}
				{this.props.model.in || (this.props.model.getParent().parentCombine && !this.props.isLast) ? label : port}
			</div>
		);
	}
}

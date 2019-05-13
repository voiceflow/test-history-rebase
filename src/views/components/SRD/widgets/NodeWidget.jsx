import React from "react";
import _ from 'lodash';
import { BaseWidget } from "./BaseWidget";

export class NodeWidget extends BaseWidget {
	// selected: boolean;

	constructor(props) {
		super("srd-node", props);

		this.state = {}
		this.selected = true;
	}

	componentDidMount(){
		this.props.node.updateDimensions(this.props.diagramEngine.getNodeDimensions(this.props.node));
	}
	
	shouldComponentUpdate() {
		let selected = this.props.node.selected;

		if(!(selected || (this.selected !== selected)) && this.props.node.id){
			return this.props.diagramEngine.canEntityRepaint(this.props.node);
		}else{
			this.selected = selected;
		}
		return true;
	}

	getClassName() {
		return `node `+ super.getClassName() + (this.props.node.isSelected() ? this.bem("--selected") : "");
	}

	render() {
		return (
			<div
				{...this.getProps()}
				data-nodeid={this.props.node.id}
				style={{
					top: this.props.node.y,
					left: this.props.node.x
				}}
				onMouseDown={() => {
					this.props.onClick ? this.props.onClick() : _.noop()
					// console.log(this.props.diagramEngine.getSuperSelect())
					window.getSelection ? window.getSelection().empty() : document.selection.empty()
				}}
			>
				{React.cloneElement(this.props.children, {
					nodeProps: this.props.nodeProps
				})}
			</div>
		);
	}
}

import _ from 'lodash';
import cn from 'classnames'
import * as React from "react";
import { BaseWidget } from "./../main.js"

/**
 * @author Dylan Vorster
 */
export class BlockPortWidget extends BaseWidget {
	constructor(props) {
		super("srd-port", props);
		this.state = {
			selected: false
		}
		this.isUnlinked = this.isUnlinked.bind(this)
		this.setLinks = this.setLinks.bind(this)
	}
	isUnlinked() {
		if (!this.props.node.ports[this.props.name]){
			return false;
		}
		return _.isEmpty(this.props.node.ports[this.props.name].links);
	}

	getClassName() {
		const { port, node, isHidden, isMoving } = this.props
		let className = cn('port', {
			in: port.in,
			out: !port.in,
			moving: isMoving,
			unlinked: this.isUnlinked(),
			'd-none': isHidden,
			'combine-port': node.parentCombine && port.in,
		})
		return super.getClassName() + (this.state.selected ? this.bem("--selected ") : " ") + className
	}

	// componentDidMount() {
	// 	this.props.node.centerLinks(this.props.diagramEngine)
	// }

	componentDidUpdate() {
		this.props.node.centerLinks(this.props.diagramEngine)
	}

	setLinks(isSelected = false){
		// const nodes = []
		if (this.props.node.ports[this.props.name]){
		_.forEach(this.props.node.ports[this.props.name].links, (link) => {
			link.setSelected(isSelected)
			// if(link.sourcePort.id === this.props.port.id){
			// 	if(link.targetPort){
			// 		link.targetPort.setSelected(isSelected)
			// 		nodes.push(link.targetPort.parent)
			// 	}
			// }else if(link.sourcePort){
			// 	link.sourcePort.setSelected(isSelected)
			// 	nodes.push(link.sourcePort.parent)
			// }
		})
		this.props.diagramEngine.enableRepaintEntities([this.props.node, ...this.props.diagramEngine.getDiagramModel().getSelectedItems()])
		this.props.diagramEngine.repaintCanvas(false)
	}
	}

	render() {
		return (
			<div
				{...this.getProps()}
				onMouseEnter={e => {
					if (!this.props.port.in) {
						this.setLinks(true);
						this.setState({ selected: true });
					}
				}}
				onMouseLeave={e => {
					this.setLinks(false);
					this.setState({ selected: false });
				}}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}

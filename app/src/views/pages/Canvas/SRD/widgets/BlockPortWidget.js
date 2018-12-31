import _ from 'lodash';
import * as React from "react";
import { NodeModel, BaseWidget, BaseWidgetProps } from "storm-react-diagrams"

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
		this.setLinks = this.setLinks.bind(this)
	}

	getClassName(){
		return "port " + super.getClassName() + ((this.state.selected) ? this.bem("--selected") : "" + (this.props.link ? "used" : ""));
	}

	setLinks(isSelected = false){
		// const nodes = []
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

	render() {
		return (
			<div
				{...this.getProps()}
				onMouseEnter={e => {
					this.setLinks(true);
					this.setState({ selected: true });
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

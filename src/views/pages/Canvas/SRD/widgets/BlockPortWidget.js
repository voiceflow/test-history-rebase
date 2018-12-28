import _ from 'lodash';
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
		this.setLinks = this.setLinks.bind(this);
	}

	getClassName(){
		return "port " + super.getClassName() + (this.state.selected ? this.bem("--selected") : "" + (this.props.link ? "used" : ""));
	}

	setLinks(isSelected = false){
		_.forEach(this.props.node.ports[this.props.name].links, (link) => {
			link.setSelected(isSelected);
		})
	}

	render() {
		return (
			<div
				{...this.getProps()}
				onMouseEnter={() => {
					this.setState({ selected: true }, () => {
						this.setLinks(true)
						this.props.diagramEngine.enableRepaintEntities([this.props.node, ...this.props.diagramEngine.getDiagramModel().getSelectedItems()])
						this.props.diagramEngine.repaintCanvas(false)
					})
				}}
				onMouseLeave={() => {
					this.setState({ selected: false }, () => {
						this.setLinks(false)
						this.props.diagramEngine.enableRepaintEntities([this.props.node, ...this.props.diagramEngine.getDiagramModel().getSelectedItems()])
						this.props.diagramEngine.repaintCanvas(false)
					})
				}}
				data-name={this.props.name}
				data-nodeid={this.props.node.getID()}
			/>
		);
	}
}

import * as React from "react";
import * as _ from "lodash";
import { BlockNodeModel } from "./../models/BlockNodeModel";
import { BlockPortLabel } from "./BlockPortLabelWidget";
import { DiagramEngine, BaseWidget, BaseWidgetProps } from "storm-react-diagrams";

export interface BlockNodeProps extends BaseWidgetProps {
	node: BlockNodeModel;
	diagramEngine: DiagramEngine;
}

export interface BlockNodeState {}

/**
 * @author Dylan Vorster
 */
export class BlockNodeWidget extends BaseWidget<BlockNodeProps, BlockNodeState> {
	constructor(props: BlockNodeProps) {
		super("srd-default-node", props);

		let type = null;

		if(props.node.extras && props.node.extras.type){
			type = props.node.extras.type;
			if(type==="multiline") type = "line";
			if(type==="choicenew") type = "choice";
		}

		this.state = {
			type: type
		};
	}

	generatePort(port) {
		return <BlockPortLabel model={port} key={port.id} />;
	}

	render() {
		return (
			<div {...this.getProps()} className={"srd-default-node " + this.state.type}>
				{this.props.node.extras && this.props.node.extras.reads ? <div className="block-reads">{this.props.node.extras.reads}</div> : null}
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>{this.props.node.name}</div>
				</div>
				<div className={this.bem("__ports")}>
					<div className={this.bem("__in")}>
						{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}
					</div>
					<div className={this.bem("__out")}>
						{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}
					</div>
				</div>
			</div>
		);
	}
}

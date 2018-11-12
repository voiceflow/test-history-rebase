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
	}

	generatePort(port) {
		return <BlockPortLabel model={port} key={port.id} />;
	}
	
	// {this.props.node.extras && this.props.node.extras.reads ? <div className="block-reads">{this.props.node.extras.reads}</div> : null}
	
	render() {
		return (
			<div className={"srd-default-node " + this.props.node.extras.type}>
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>
						{this.props.node.name ? this.props.node.name : this.props.node.extras.type.charAt(0).toUpperCase() + this.props.node.extras.type.substr(1)}
						{
							this.props.node.extras.type === 'module'?
							<span>
		                        <img src={this.props.node.extras.module_icon} alt={this.props.node.extras.title}/>
		                    </span>
							:
							null
						}
					</div>
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

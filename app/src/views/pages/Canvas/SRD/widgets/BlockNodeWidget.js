import * as React from "react";
import * as _ from "lodash";
import { BlockNodeModel } from "./../models/BlockNodeModel";
import { BlockPortLabel } from "./BlockPortLabelWidget";
import { DiagramEngine, BaseWidget, BaseWidgetProps } from "storm-react-diagrams";
import Textarea from 'react-textarea-autosize';

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
		return <BlockPortLabel model={port} key={port.id} diagramEngine={this.props.diagramEngine}/>;
	}

	// {this.props.node.extras && this.props.node.extras.reads ? <div className="block-reads">{this.props.node.extras.reads}</div> : null}

	render() {
		if(this.props.node.extras.type === 'comment'){
			return <div className={"srd-default-node " + this.props.node.extras.type}>
              	<Textarea value={this.props.node.name} readOnly={this.props.locked} onChange={e => {this.props.node.name = e.target.value; this.forceUpdate();}} />
			</div>
		}

		return (
			<div className={"srd-default-node " + this.props.node.extras.type}>
				<div className={this.bem("__title") + ' no-select'}>
					<div className={this.bem("__name")}>
            			{this.props.node.name ? this.props.node.name : this.props.node.extras.type.charAt(0).toUpperCase() + this.props.node.extras.type.substr(1)}
					</div>
				</div>
				<div className={this.bem("__ports")}>
					<div className={this.bem("__in")}>
						{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}
					</div>
					{
						this.props.node.extras.type === 'module'?
							<React.Fragment>
								<img className="rounded ModuleIcon" draggable={false} src={this.props.node.extras.module_icon} alt={this.props.node.extras.title}/>
								<h5 className="ml-1">(Vers. {this.props.node.extras.version_id})</h5>
							</React.Fragment>
							:null
					}
					<div className={this.bem("__out")}>
						{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}
					</div>
				</div>
			</div>
		);
	}
}

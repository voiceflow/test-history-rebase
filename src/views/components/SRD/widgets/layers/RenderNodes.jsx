import React from "react";
import _ from "lodash";
import { NodeWidget } from "../NodeWidget";
import { NodeModel } from "../../models/NodeModel";
import { BaseWidget } from "../BaseWidget";

// export interface NodeLayerProps extends BaseWidgetProps {
// 	diagramEngine: DiagramEngine;
// }
//
// export interface NodeLayerState {}

export class RenderNodes extends BaseWidget {

	constructor(props) {
		super("srd-node-layer", props);
		this.state = {};
	}

	shouldComponentUpdate() {
		// console.log(this.props.diagramEngine.getMove());
		return !this.props.diagramEngine.getMove();
	}

	updateNodeDimensions = () => {
		if (!this.props.diagramEngine.nodesRendered) {
			const diagramModel = this.props.diagramEngine.getDiagramModel();
			_.map(diagramModel.getNodes(), node => {
				node.updateDimensions(this.props.diagramEngine.getNodeDimensions(node));
			});
		}
	};

	componentDidUpdate() {
		this.updateNodeDimensions();
		this.props.diagramEngine.nodesRendered = true;
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();

		return <React.Fragment>
				{_.map(diagramModel.getNodes(), (node: NodeModel) => {
					return React.createElement(
						NodeWidget,
						{
							diagramEngine: this.props.diagramEngine,
							key: node.id,
							node: node,
							nodeProps: this.props.nodeProps
						},
						this.props.diagramEngine.generateWidgetForNode(node)
					);
				})}
		</React.Fragment>
	}
}

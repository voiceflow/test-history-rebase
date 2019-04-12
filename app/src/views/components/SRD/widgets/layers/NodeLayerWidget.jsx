import React from "react";

import { BaseWidget } from "../BaseWidget";
import { RenderNodes } from "./RenderNodes";

// export interface NodeLayerProps extends BaseWidgetProps {
// 	diagramEngine: DiagramEngine;
// }
//
// export interface NodeLayerState {}

export class NodeLayerWidget extends BaseWidget {
	constructor(props: NodeLayerProps) {
		super("srd-node-layer", props);
		this.state = {};
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return (
			<div
				{...this.getProps()}
				style={{
					transform:
						"translate(" +
						diagramModel.getOffsetX() +
						"px," +
						diagramModel.getOffsetY() +
						"px) scale(" +
						diagramModel.getZoomLevel() / 100.0 +
						")"
				}}
			>
				<RenderNodes
					diagramEngine={this.props.diagramEngine}
					nodeProps={this.props.nodeProps}
				/>
			</div>
		);
	}
}

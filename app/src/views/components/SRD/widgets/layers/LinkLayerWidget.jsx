import React from "react";
import { BaseWidget } from "../BaseWidget";
import { RenderLinks } from "./RenderLinks";

// export interface LinkLayerProps extends BaseWidgetProps {
// 	diagramEngine: DiagramEngine;
// 	pointAdded: (point: PointModel, event: MouseEvent) => any;
// }
//
// export interface LinkLayerState {}
//
// /**
//  * @author Dylan Vorster
//  */
export class LinkLayerWidget extends BaseWidget {
	constructor(props) {
		super("srd-link-layer", props);
		this.state = {};
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return (
			<svg
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
				<RenderLinks diagramEngine={this.props.diagramEngine} pointAdded={this.props.pointAdded}/>
			</svg>
		);
	}
}

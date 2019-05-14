import React from "react";
import _ from "lodash";

import { LinkWidget } from "../LinkWidget";
import { BaseWidget } from "../BaseWidget";

// export interface LinkLayerProps extends BaseWidgetProps {
// 	diagramEngine: DiagramEngine;
// 	pointAdded: (point: PointModel, event: MouseEvent) => any;
// }
//
// export interface LinkLayerState {}

export class RenderLinks extends BaseWidget {
	constructor(props: LinkLayerProps) {
		super("render-links", props);
		this.state = {};
	}

	shouldComponentUpdate() {
		return !this.props.diagramEngine.getMove();
	}

	render() {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		return <React.Fragment>
			{this.props.diagramEngine.canvas &&
			_.map(diagramModel.getLinks(), link => {
				if (
					this.props.diagramEngine.nodesRendered &&
					!this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id]
				) {
					if (!!link.sourcePort && !link.sourcePort.hidden) {
						try {
							const portCenter = this.props.diagramEngine.getPortCenter(link.sourcePort);
							link.points[0].updateLocation(portCenter);

							const portCoords = this.props.diagramEngine.getPortCoords(link.sourcePort);
							link.sourcePort.updateCoords(portCoords);

							this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
						} catch (ignore) {
							/*noop*/
						}
					}
					if (link.targetPort !== null && !link.targetPort.hidden) {
						try {
							const portCenter = this.props.diagramEngine.getPortCenter(link.targetPort);
							_.last(link.points).updateLocation(portCenter);

							const portCoords = this.props.diagramEngine.getPortCoords(link.targetPort);
							link.targetPort.updateCoords(portCoords);

							this.props.diagramEngine.linksThatHaveInitiallyRendered[link.id] = true;
						} catch (ignore) {
							/*noop*/
						}
					}
				}

				//generate links
				var generatedLink = this.props.diagramEngine.generateWidgetForLink(link);
				if (!generatedLink) {
					throw new Error(`no link generated for type: ${link.getType()}`);
				}
				return (
					<LinkWidget key={link.getID()} link={link} diagramEngine={this.props.diagramEngine}>
						{React.cloneElement(generatedLink, {
							pointAdded: this.props.pointAdded
						})}
					</LinkWidget>
				);
			})}
		</React.Fragment>;
	}
}

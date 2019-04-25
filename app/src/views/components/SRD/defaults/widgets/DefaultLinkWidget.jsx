import React from "react";
import _ from "lodash";

import { DiagramEngine } from "../../DiagramEngine";
import { PointModel } from "../../models/PointModel";
import { Toolkit } from "../../Toolkit.jsx";
import { DefaultLinkModel } from "../models/DefaultLinkModel";
import PathFinding from "../../routing/PathFinding";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";
import cn from 'classnames'

const toolkit = new Toolkit()

export interface DefaultLinkProps extends BaseWidgetProps {
	color: string;
	width: number;
	smooth: boolean;
	link: DefaultLinkModel;
	diagramEngine: DiagramEngine;
	pointAdded: any;
}

export interface DefaultLinkState {
	selected: boolean;
}

export class DefaultLinkWidget extends BaseWidget<DefaultLinkProps, DefaultLinkState> {

	// // DOM references to the label and paths (if label is given), used to calculate dynamic positioning
	// refLabels: { [id: string]: HTMLElement };
	// refPaths: SVGPathElement[];
	//
	// pathFinding: PathFinding; // only set when smart routing is active

	constructor(props: DefaultLinkProps) {
		super("srd-default-link", props);

		this.refLabels = {};
		this.refPaths = [];
		this.state = {
			selected: false
		};
		if (props.diagramEngine.isSmartRoutingEnabled()) {
			this.pathFinding = new PathFinding(this.props.diagramEngine);
		}
	}

	calculateAllLabelPosition() {
		_.forEach(this.props.link.labels, (label, index) => {
			this.calculateLabelPosition(label, index + 1);
		});
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.link.labels.length > 0) {
			window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
		}
		// console.log("update", this.props.link.sourcePort, this.props.link.targetPort)

		const source = this.props.link.sourcePort
		const target = this.props.link.targetPort

		if (source) {
			let center
			try {
				center = this.props.diagramEngine.getPortCenter(source)
			} catch (e) {}
			if (center) {
				_.forEach(source.links, link => {
					if (!_.isEmpty(link.points) && link.points.length >= 2) {
						if (source.in) {
							let point = _.last(link.points)
							point.updateLocation(center)
						} else {
							let point = _.head(link.points)
							point.updateLocation(center)
						}
					} else {
						link.remove()
					}
				})
			}
		}

		if (target) {
			let center
			try {
				center = this.props.diagramEngine.getPortCenter(target)
			} catch (e) {}
			if (center) {
				_.forEach(target.links, link => {
					if (!_.isEmpty(link.points) && link.points.length >= 2) {
						if (target.in) {
							let point = _.last(link.points)
							point.updateLocation(center)
						} else {
							let point = _.head(link.points)
							point.updateLocation(center)
						}
					} else {
						link.remove()
					}
				})
			}
		}
	}

	componentDidMount() {
		if (this.props.link.labels.length > 0) {
			window.requestAnimationFrame(this.calculateAllLabelPosition.bind(this));
		}
	}

	addPointToLink(event, index){
		if (
			!event.shiftKey &&
			!this.props.diagramEngine.isModelLocked(this.props.link) &&
			this.props.link.points.length - 1 <= this.props.diagramEngine.getMaxNumberPointsPerLink()
		) {
			const point = new PointModel(this.props.link, this.props.diagramEngine.getRelativeMousePoint(event), toolkit.UID());
			point.setSelected(true);
			this.forceUpdate();
			this.props.link.addPoint(point, index);
			this.props.pointAdded(point, event);
		}
	};

	generatePoint(pointIndex) {
		let x = this.props.link.points[pointIndex].x;
		let y = this.props.link.points[pointIndex].y;
		return (
			<g key={"point-" + this.props.link.points[pointIndex].id}>
				<circle
					cx={x}
					cy={y}
					r={5}
					className={
						"point " +
						this.bem("__point") +
						(this.props.link.points[pointIndex].isSelected() ? this.bem("--point-selected") : "")
					}
				/>
				<circle
					onMouseLeave={() => {
						this.setState({ selected: false });
					}}
					onMouseEnter={() => {
						this.setState({ selected: true });
					}}
					data-id={this.props.link.points[pointIndex].id}
					data-linkid={this.props.link.id}
					cx={x}
					cy={y}
					r={15}
					opacity={0}
					className={"point " + this.bem("__point")}
				/>
			</g>
		);
	}

	generateLabel(label) {
		// const canvas = React.createElement(this.props.diagramEngine.canvas);
		// return (
		// 	<foreignObject
		// 		key={label.id}
		// 		className={this.bem("__label")}
		// 		width={canvas.offsetWidth}
		// 		height={canvas.offsetHeight}
		// 	>
		// 		<div ref={ref => (this.refLabels[label.id] = ref)}>
		// 			{this.props.diagramEngine
		// 				.getFactoryForLabel(label)
		// 				.generateReactWidget(this.props.diagramEngine, label)}
		// 		</div>
		// 	</foreignObject>
		// );
	}

	generateLink(path, extraProps, id, isLast = false) {
		var props = this.props;
		var Bottom = React.cloneElement(
			(props.diagramEngine.getFactoryForLink(this.props.link)).generateLinkSegmentWithEnd(
				this.props.link,
				this,
				this.state.selected || this.props.link.isSelected(),
				path
			),
			{
				ref: ref => ref && this.refPaths.push(ref)
			}
		);
		if (isLast){
			Bottom = React.cloneElement(
				(props.diagramEngine.getFactoryForLink(this.props.link)).generateLinkSegment(
					this.props.link,
					this,
					this.state.selected || this.props.link.isSelected(),
					path
				),
				{
					ref: ref => ref && this.refPaths.push(ref)
				}
			);
		}
		var Top = React.cloneElement(Bottom, {
			...extraProps,
			strokeLinecap: "round",
			onMouseLeave: () => {
				this.setState({ selected: false });
			},
			onMouseEnter: () => {
				this.setState({ selected: true });
			},
			ref: null,
			"data-linkid": this.props.link.getID(),
			strokeOpacity: this.state.selected ? 0.1 : 0,
			strokeWidth: 20,
			onContextMenu: (event) => {
				if (!this.props.diagramEngine.isModelLocked(this.props.link)) {
					event.preventDefault();
					this.props.link.remove();
				}
			}
		});
		// Delete line stuff do not touch
		let svgPosition;
		if(_.last(this.refPaths) && this.refPaths.length === 1 && this.props.link.sourcePort && this.props.link.targetPort)	{
			let lengths = _.last(this.refPaths).getTotalLength();
			svgPosition = _.last(this.refPaths).getPointAtLength(lengths/2)
		}

		const styleObj = {}
		if (this.props.link.hidden) styleObj.visibility = 'hidden'

		return (
			<g key={"link-" + id} style={styleObj}>
				{Bottom}
				{Top}
				{svgPosition && this.state.selected && !this.props.preview ? (
				<foreignObject
					x={svgPosition.x - 20}
					y={svgPosition.y - 15}
					width='40px'
					height='40px'
					style={{
					zIndex: 10,
					position: 'absolute',
					}}
					onClick={e => {
					// e.preventDefault();
					this.props.link.remove();
					this.props.diagramEngine.repaintCanvas(false)
					}}
					onMouseLeave={() => {
					this.setState({ selected: false });
					}}
					onMouseEnter={() => {
					this.setState({ selected: true });
					}}
				>
					<button id="trash" className="btn-action ml-1"></button>
				</foreignObject>
				) : null}
			</g>
    	);
	}

	findPathAndRelativePositionToRenderLabel = index => {
		// an array to hold all path lengths, making sure we hit the DOM only once to fetch this information
		const lengths = this.refPaths.map(path => path.getTotalLength());
		// calculate the point where we want to display the label
		let labelPosition =
			lengths.reduce((previousValue, currentValue) => previousValue + currentValue, 0) *
			(index/ (this.props.link.labels.length + 1));

		// find the path where the label will be rendered and calculate the relative position
		let pathIndex = 0;
		while (pathIndex < this.refPaths.length) {
			if (labelPosition - lengths[pathIndex] < 0) {
				return {
					path: this.refPaths[pathIndex],
					position: labelPosition
				};
			}

			// keep searching
			labelPosition -= lengths[pathIndex];
			pathIndex++;
		}
	};

	calculateLabelPosition = (label, index) => {
		if (!this.refLabels[label.id]) {
			// no label? nothing to do here
			return;
		}

		const { path, position } = this.findPathAndRelativePositionToRenderLabel(index);

		const labelDimensions = {
			width: this.refLabels[label.id].offsetWidth,
			height: this.refLabels[label.id].offsetHeight
		};
		const pathCentre = path.getPointAtLength(position);

		const labelCoordinates = {
			x: pathCentre.x - labelDimensions.width / 2 + label.offsetX,
			y: pathCentre.y - labelDimensions.height / 2 + label.offsetY
		};
		this.refLabels[label.id].setAttribute(
			"style",
			`transform: translate(${labelCoordinates.x}px, ${labelCoordinates.y}px);`
		);
	};

	/**
	 * Smart routing is only applicable when all conditions below are true:
	 * - smart routing is set to true on the engine
	 * - current link is between two nodes (not between a node and an empty point)
	 * - no custom points exist along the line
	 */
	isSmartRoutingApplicable(): boolean {
		const { diagramEngine, link } = this.props;
		if (!diagramEngine.isSmartRoutingEnabled()) {
			return false;
		}

		if (link.points.length !== 2) {
			return false;
		}

		if (link.sourcePort === null || link.targetPort === null) {
			return false;
		}

		return true;
	}

	render() {
		const { diagramEngine } = this.props;
		if (!diagramEngine.nodesRendered) {
			return null;
		}

		//ensure id is present for all points on the path
		var points = this.props.link.points;
		var paths = [];
		if (this.isSmartRoutingApplicable()) {
			// first step: calculate a direct path between the points being linked
			const directPathCoords = this.pathFinding.calculateDirectPath(_.first(points), _.last(points));

			const routingMatrix = diagramEngine.getRoutingMatrix();
			// now we need to extract, from the routing matrix, the very first walkable points
			// so they can be used as origin and destination of the link to be created
			const smartLink = this.pathFinding.calculateLinkStartEndCoords(routingMatrix, directPathCoords);
			if (smartLink) {
				const { start, end, pathToStart, pathToEnd } = smartLink;

				// second step: calculate a path avoiding hitting other elements
				const simplifiedPath = this.pathFinding.calculateDynamicPath(
					routingMatrix,
					start,
					end,
					pathToStart,
					pathToEnd
				);

				paths.push(
					//smooth: boolean, extraProps: any, id: string | number, firstPoint: PointModel, lastPoint: PointModel
					this.generateLink(
						toolkit.generateDynamicPath(simplifiedPath),
						{
							onMouseDown: event => {
								this.addPointToLink(event, 1);
							}
						},
						"0"
					)
				);
			}
		}
		// true when smart routing was skipped or not enabled.
		// See @link{#isSmartRoutingApplicable()}.
		if (paths.length === 0) {
			if (points.length === 2) {
				// var isHorizontal = true;
				// var xOrY = isHorizontal ? "x" : "y";

				//draw the smoothing
				//if the points are too close, just draw a straight line
				// var margin = 50;
				// if (Math.abs(points[0][xOrY] - points[1][xOrY]) < 50) {
				// 	margin = 5;
				// }

				var pointLeft = points[0];
				var pointRight = points[1];

				//some defensive programming to make sure the smoothing is
				//always in the right direction
				// if (pointLeft[xOrY] > pointRight[xOrY]) {
				// 	pointLeft = points[1];
				// 	pointRight = points[0];
				// }
				paths.push(
					this.generateLink(
						toolkit.generateCurvePath(pointLeft, pointRight, this.props.link.curvyness),
						{
							onMouseDown: event => {
								this.addPointToLink(event, 1);
							}
						},
						"0"
					)
				);
				// draw the link as dangeling
				if (this.props.link.targetPort === null) {
					paths.push(this.generatePoint(1));
				}
			} else {
				//draw the multiple anchors and complex line instead
				for (let j = 0; j < points.length - 1; j++) {
					paths.push(
						this.generateLink(
							toolkit.generateLinePath(points[j], points[j + 1]),
							{
								"data-linkid": this.props.link.id,
								"data-point": j,
								onMouseDown: (event: MouseEvent) => {
									this.addPointToLink(event, j + 1);
								}
							},
							j,
							j !== points.length -2
						)
					);
				}

				//render the circles
				for (var i = 1; i < points.length - 1; i++) {
					paths.push(this.generatePoint(i));
				}

				if (this.props.link.targetPort === null) {
					paths.push(this.generatePoint(points.length - 1));
				}
			}
		}
		this.refPaths = [];
		return (
			<g {...this.getProps()}>
				{paths}
				{_.map(this.props.link.labels, labelModel => {
					return this.generateLabel(labelModel);
				})}
			</g>
		);
	}
}

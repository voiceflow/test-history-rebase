import { BaseEntity } from "./BaseEntity.jsx";
import { DiagramModel } from "./models/DiagramModel";
import _ from "lodash";
import { NodeModel } from "./models/NodeModel";
import { PointModel } from "./models/PointModel";
import { PortModel } from "./models/PortModel";
import { LinkModel } from "./models/LinkModel";
import { DefaultLinkFactory, DefaultNodeFactory } from "./main";
import { ROUTING_SCALING_FACTOR } from "./routing/PathFinding";
import { DefaultPortFactory } from "./defaults/factories/DefaultPortFactory";
import { DefaultLabelFactory } from "./defaults/factories/DefaultLabelFactory";
import { Toolkit } from "./Toolkit.jsx";
/**
 * @author Dylan Vorster
 */
//  var DiagramEngineListener = {
// 	 portFactoriesUpdated: (),
// 	 nodeFactoriesUpdated: (),
// 	 linkFactoriesUpdated: (),
// 	 labelFactoriesUpdated: (),
// 	 repaintCanvas: (clear_entities),
//  }
//
// export interface DiagramEngineListener extends BaseListener {
// 	portFactoriesUpdated?(): void;
//
// 	nodeFactoriesUpdated?(): void;
//
// 	linkFactoriesUpdated?(): void;
//
// 	labelFactoriesUpdated?(): void;
//
// 	repaintCanvas?(clear_entities: boolean): void;
// }

/**
 * Passed as a parameter to the DiagramWidget
 */
export class DiagramEngine extends BaseEntity {

	constructor() {
		super();
		this.diagramModel = new DiagramModel();
		this.nodeFactories = {};
		this.linkFactories = {};
		this.portFactories = {};
		this.labelFactories = {};
		this.superSelect = null;
		this.canvas = null;
		this.combineCanvas = null;
		this.paintableWidgets = null;
		this.moving = false;
		this.linksThatHaveInitiallyRendered = {};

		if (Toolkit.TESTING) {
			Toolkit.TESTING_UID = 0;

			//pop it onto the window so our E2E helpers can find it
			if (window) {
				(window)["diagram_instance"] = this;
			}
		}
	}

	installDefaultFactories() {
		this.registerNodeFactory(new DefaultNodeFactory());
		this.registerLinkFactory(new DefaultLinkFactory());
		this.registerPortFactory(new DefaultPortFactory());
		this.registerLabelFactory(new DefaultLabelFactory());
	}

	repaintCanvas(clear_entities = true) {
		this.iterateListeners(listener => {
			if (listener.repaintCanvas) {
				listener.repaintCanvas(clear_entities);
			}
		});
	}

	clearRepaintEntities() {
		this.paintableWidgets = null;
	}

	hasRepaint(){
		return !(_.isEmpty(this.paintableWidgets));
	}

	startMove(){
		this.moving = true;
	}

	stopMove(){
		this.moving = false;
	}

	getMove(){
		return this.moving;
	}

	enableRepaintEntities(entities){
		// if (_.size(entities) === 1) {
		// 	entities = [this.superSelect];
		// }
		this.paintableWidgets = {};
		entities.forEach(entity => {
			//if a node is requested to repaint, add all of its links
			if (entity instanceof NodeModel && !entity.parentCombine) {
				_.forEach(entity.getPorts(), port => {
					if (port instanceof PortModel){
						_.forEach(port.getLinks(), link => {
							if (link instanceof LinkModel){
								this.paintableWidgets[link.getID()] = true;
							}
						});
					}
				});
			}

			if (entity instanceof PointModel) {
				this.paintableWidgets[entity.getLink().getID()] = true;
			}
			this.paintableWidgets[entity.getID()] = true;
		});
	}
	isModelLocked(model){
		//always check the diagram model
		if (this.diagramModel.isLocked()) {
			return true;
		}

		return this.diagramModel.isLocked();
	}

	recalculatePortsVisually() {
		this.nodesRendered = false;
		this.linksThatHaveInitiallyRendered = {};
	}

	getSuperSelect(){
		return this.superSelect
	}

	setSuperSelect(node){
		this.superSelect = node;
	}

	canEntityRepaint(baseModel) {
		//no rules applied, allow repaint
		if (this.paintableWidgets === null) {
			return true;
		}
		if(this.superSelect !== null && (baseModel.getID() === this.superSelect.getID())){
			return true;
		}
		return this.paintableWidgets[baseModel.getID()] !== undefined;
	}

	setCanvas(canvas) {
		this.canvas = canvas;
	}

	setCombineCanvas(canvas) {
		this.combineCanvas = canvas
	}
	setDiagramModel(model) {
		this.diagramModel = model;
		this.recalculatePortsVisually();
	}

	getDiagramModel() {
		return this.diagramModel;
	}

	//!-------------- FACTORIES ------------

	getNodeFactories() {
		return this.nodeFactories;
	}

	getLinkFactories(){
		return this.linkFactories;
	}

	getLabelFactories() {
		return this.labelFactories;
	}

	registerLabelFactory(factory) {
		this.labelFactories[factory.getType()] = factory;
		this.iterateListeners(listener => {
			if (listener.labelFactoriesUpdated) {
				listener.labelFactoriesUpdated();
			}
		});
	}

	registerPortFactory(factory) {
		this.portFactories[factory.getType()] = factory;
		this.iterateListeners(listener => {
			if (listener.portFactoriesUpdated) {
				listener.portFactoriesUpdated();
			}
		});
	}

	registerNodeFactory(factory) {
		this.nodeFactories[factory.getType()] = factory;
		this.iterateListeners(listener => {
			if (listener.nodeFactoriesUpdated) {
				listener.nodeFactoriesUpdated();
			}
		});
	}

	registerLinkFactory(factory) {
		this.linkFactories[factory.getType()] = factory;
		this.iterateListeners(listener => {
			if (listener.linkFactoriesUpdated) {
				listener.linkFactoriesUpdated();
			}
		});
	}

	getPortFactory(type: string) {
		if (this.portFactories["default"]) {
			return this.portFactories["default"];
		}
		throw new Error(`cannot find factory for port of type: [${type}]`);
	}

	getNodeFactory(type: string) {
		if (this.nodeFactories["default"]) {
			return this.nodeFactories["default"];
		}
		throw new Error(`cannot find factory for node of type: [${type}]`);
	}

	getLinkFactory(type: string){
		if (this.linkFactories["default"]) {
			return this.linkFactories["default"];
		}
		throw new Error(`cannot find factory for link of type: [${type}]`);
	}

	getLabelFactory(type: string) {
		if (this.labelFactories["default"]) {
			return this.labelFactories["default"];
		}
		throw new Error(`cannot find factory for label of type: [${type}]`);
	}

	getFactoryForNode(node){
		return this.getNodeFactory(node.getType());
	}

	getFactoryForLink(link){
		return this.getLinkFactory(link.getType());
	}

	getFactoryForLabel(label){
		return this.getLabelFactory(label.getType());
	}

	generateWidgetForLink(link) {
		var linkFactory = this.getFactoryForLink(link);
		if (!linkFactory) {
			throw new Error("Cannot find link factory for link: " + link.getType());
		}
		return linkFactory.generateReactWidget(this, link);
	}

	generateWidgetForNode(node) {
		var nodeFactory = this.getFactoryForNode(node);
		if (!nodeFactory) {
			throw new Error("Cannot find widget factory for node: " + node.getType());
		}
		return nodeFactory.generateReactWidget(this, node);
	}

	getRelativeMousePoint(event){
		var point = this.getRelativePoint(event.clientX, event.clientY);
		return {
			x: (point.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
			y: (point.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
		};
	}

	getRelativePoint(x, y) {
		var canvasRect = this.canvas.getBoundingClientRect();
		return { x: x - canvasRect.left, y: y - canvasRect.top };
	}

	getNodeElement(node) {
		const selector = this.canvas.querySelector(`.node[data-nodeid="${node.id}"]`);
		if (selector === null) {
			let combineSelector = null;
			if (this.combineCanvas){
				combineSelector = this.combineCanvas.querySelector(`.srd-default-node[data-nodeid="${node.id}"]`)
			}
			if (combineSelector){
				return combineSelector
			}
			throw new Error("Cannot find Node element with nodeID: [" + node.id + "]");
		}
		return selector;
	}

	getNodePortElement(port){
		var selector = this.canvas.querySelector(
			`.port[data-name="${port.getName()}"][data-nodeid="${port.getParent().getID()}"]`
		);
		if (selector === null) {
			throw new Error(
				"Cannot find Node Port element with nodeID: [" +
					port.getParent().getID() +
					"] and name: [" +
					port.getName() +
					"]"
			);
		}
		return selector;
	}

	getPortCenter(port) {
		var sourceElement = this.getNodePortElement(port);
		var sourceRect = sourceElement.getBoundingClientRect();

		var rel = this.getRelativePoint(sourceRect.left, sourceRect.top);

		if (sourceRect.x === 0 && sourceRect.y === 0) {
			return {
				x: port.x,
				y: port.y
			}
		}
		return {
			x:
				sourceElement.offsetWidth / 2 +
				(rel.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0),
			y:
				sourceElement.offsetHeight / 2 +
				(rel.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0)
		};
	}

	/**
	 * Calculate rectangular coordinates of the port passed in.
	 */
	getPortCoords(port){
		const sourceElement = this.getNodePortElement(port);
		const sourceRect = sourceElement.getBoundingClientRect();
		const canvasRect = this.canvas.getBoundingClientRect();

		return {
			x:
				(sourceRect.x - this.diagramModel.getOffsetX()) / (this.diagramModel.getZoomLevel() / 100.0) -
				canvasRect.left,
			y:
				(sourceRect.y - this.diagramModel.getOffsetY()) / (this.diagramModel.getZoomLevel() / 100.0) -
				canvasRect.top,
			width: sourceRect.width,
			height: sourceRect.height
		};
	}

	/**
	 * Determine the width and height of the node passed in.
	 * It currently assumes nodes have a rectangular shape, can be overriden for customised shapes.
	 */
	getNodeDimensions(node){
		if (!this.canvas) {
			return {
				width: 0,
				height: 0
			};
		}
		const nodeElement = this.getNodeElement(node);
		const nodeRect = nodeElement.getBoundingClientRect();
		return {
			width: nodeRect.width,
			height: nodeRect.height
		};
	}

	getMaxNumberPointsPerLink() {
		return this.maxNumberPointsPerLink;
	}

	setMaxNumberPointsPerLink(max) {
		this.maxNumberPointsPerLink = max;
	}

	isSmartRoutingEnabled() {
		return !!this.smartRouting;
	}
	setSmartRoutingStatus(status) {
		this.smartRouting = status;
	}

	/**
	 * A representation of the canvas in the following format:
	 *
	 * +-----------------+
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * | 0 0 0 0 0 0 0 0 |
	 * +-----------------+
	 *
	 * In which all walkable points are marked by zeros.
	 * It uses @link{#ROUTING_SCALING_FACTOR} to reduce the matrix dimensions and improve performance.
	 */
	getCanvasMatrix() {
		if (this.canvasMatrix.length === 0) {
			this.calculateCanvasMatrix();
		}

		return this.canvasMatrix;
	}
	calculateCanvasMatrix() {
		const {
			width: canvasWidth,
			hAdjustmentFactor,
			height: canvasHeight,
			vAdjustmentFactor
		} = this.calculateMatrixDimensions();

		this.hAdjustmentFactor = hAdjustmentFactor;
		this.vAdjustmentFactor = vAdjustmentFactor;

		const matrixWidth = Math.ceil(canvasWidth / ROUTING_SCALING_FACTOR);
		const matrixHeight = Math.ceil(canvasHeight / ROUTING_SCALING_FACTOR);

		this.canvasMatrix = _.range(0, matrixHeight).map(() => {
			return new Array(matrixWidth).fill(0);
		});
	}

	/**
	 * A representation of the canvas in the following format:
	 *
	 * +-----------------+
	 * | 0 0 1 1 0 0 0 0 |
	 * | 0 0 1 1 0 0 1 1 |
	 * | 0 0 0 0 0 0 1 1 |
	 * | 1 1 0 0 0 0 0 0 |
	 * | 1 1 0 0 0 0 0 0 |
	 * +-----------------+
	 *
	 * In which all points blocked by a node (and its ports) are
	 * marked as 1; points were there is nothing (ie, free) receive 0.
	 */
	getRoutingMatrix() {
		if (this.routingMatrix.length === 0) {
			this.calculateRoutingMatrix();
		}

		return this.routingMatrix;
	}
	calculateRoutingMatrix(){
		const matrix = _.cloneDeep(this.getCanvasMatrix());

		// nodes need to be marked as blocked points
		this.markNodes(matrix);
		// same thing for ports
		this.markPorts(matrix);

		this.routingMatrix = matrix;
	}

	/**
	 * The routing matrix does not have negative indexes, but elements could be negatively positioned.
	 * We use the functions below to translate back and forth between these coordinates, relying on the
	 * calculated values of hAdjustmentFactor and vAdjustmentFactor.
	 */
	translateRoutingX(x, reverse = false) {
		return x + this.hAdjustmentFactor * (reverse ? -1 : 1);
	}
	translateRoutingY(y, reverse = false) {
		return y + this.vAdjustmentFactor * (reverse ? -1 : 1);
	}

	/**
	 * Despite being a long method, we simply iterate over all three collections (nodes, ports and points)
	 * to find the highest X and Y dimensions, so we can build the matrix large enough to contain all elements.
	 */
	calculateMatrixDimensions(){
		const allNodesCoords = _.values(this.diagramModel.nodes).map(item => ({
			x: item.x,
			width: item.width,
			y: item.y,
			height: item.height
		}));

		const allLinks = _.values(this.diagramModel.links);
		const allPortsCoords = _.flatMap(allLinks.map(link => [link.sourcePort, link.targetPort]))
			.filter(port => port !== null)
			.map(item => ({
				x: item.x,
				width: item.width,
				y: item.y,
				height: item.height
			}));
		const allPointsCoords = _.flatMap(allLinks.map(link => link.points)).map(item => ({
			// points don't have width/height, so let's just use 0
			x: item.x,
			width: 0,
			y: item.y,
			height: 0
		}));

		const canvas = this.canvas;
		const minX =
			Math.floor(
				Math.min(_.minBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.x).x, 0) /
					ROUTING_SCALING_FACTOR
			) * ROUTING_SCALING_FACTOR;
		const maxXElement = _.maxBy(
			_.concat(allNodesCoords, allPortsCoords, allPointsCoords),
			item => item.x + item.width
		);
		const maxX = Math.max(maxXElement.x + maxXElement.width, canvas.offsetWidth);

		const minY =
			Math.floor(
				Math.min(_.minBy(_.concat(allNodesCoords, allPortsCoords, allPointsCoords), item => item.y).y, 0) /
					ROUTING_SCALING_FACTOR
			) * ROUTING_SCALING_FACTOR;
		const maxYElement = _.maxBy(
			_.concat(allNodesCoords, allPortsCoords, allPointsCoords),
			item => item.y + item.height
		);
		const maxY = Math.max(maxYElement.y + maxYElement.height, canvas.offsetHeight);

		return {
			width: Math.ceil(Math.abs(minX) + maxX),
			hAdjustmentFactor: Math.abs(minX) / ROUTING_SCALING_FACTOR + 1,
			height: Math.ceil(Math.abs(minY) + maxY),
			vAdjustmentFactor: Math.abs(minY) / ROUTING_SCALING_FACTOR + 1
		};
	};

	/**
	 * Updates (by reference) where nodes will be drawn on the matrix passed in.
	 */
	markNodes(matrix){
		_.values(this.diagramModel.nodes).forEach(node => {
			const startX = Math.floor(node.x / ROUTING_SCALING_FACTOR);
			const endX = Math.ceil((node.x + node.width) / ROUTING_SCALING_FACTOR);
			const startY = Math.floor(node.y / ROUTING_SCALING_FACTOR);
			const endY = Math.ceil((node.y + node.height) / ROUTING_SCALING_FACTOR);

			for (let x = startX - 1; x <= endX + 1; x++) {
				for (let y = startY - 1; y < endY + 1; y++) {
					this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
				}
			}
		});
	};

	/**
	 * Updates (by reference) where ports will be drawn on the matrix passed in.
	 */
	markPorts(matrix){
		const allElements = _.flatMap(
			_.values(this.diagramModel.links).map(link => [].concat(link.sourcePort, link.targetPort))
		);
		allElements.filter(port => port !== null).forEach(port => {
			const startX = Math.floor(port.x / ROUTING_SCALING_FACTOR);
			const endX = Math.ceil((port.x + port.width) / ROUTING_SCALING_FACTOR);
			const startY = Math.floor(port.y / ROUTING_SCALING_FACTOR);
			const endY = Math.ceil((port.y + port.height) / ROUTING_SCALING_FACTOR);

			for (let x = startX - 1; x <= endX + 1; x++) {
				for (let y = startY - 1; y < endY + 1; y++) {
					this.markMatrixPoint(matrix, this.translateRoutingX(x), this.translateRoutingY(y));
				}
			}
		});
	};

	markMatrixPoint(matrix, x, y){
		if (matrix[y] !== undefined && matrix[y][x] !== undefined) {
			matrix[y][x] = 1;
		}
	};

	zoomToFit() {
		const xFactor = this.canvas.clientWidth / this.canvas.scrollWidth;
		const yFactor = this.canvas.clientHeight / this.canvas.scrollHeight;
		const zoomFactor = xFactor < yFactor ? xFactor : yFactor;

		this.diagramModel.setZoomLevel(this.diagramModel.getZoomLevel() * zoomFactor);
		this.diagramModel.setOffset(0, 0);
		this.repaintCanvas();
	}
}

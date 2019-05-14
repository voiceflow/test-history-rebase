import React from "react";
import _ from "lodash";
import { Alert } from 'reactstrap';
import { LinkLayerWidget } from "./layers/LinkLayerWidget";
import { NodeLayerWidget } from "./layers/NodeLayerWidget";
import { Toolkit } from "../Toolkit.jsx";
import { MoveCanvasAction } from "../actions/MoveCanvasAction";
import { MoveItemsAction } from "../actions/MoveItemsAction";
import { SelectingAction } from "../actions/SelectingAction";
import { NodeModel } from "../models/NodeModel";
import { BlockNodeModel } from '../models/BlockNodeModel';
import { PointModel } from "../models/PointModel";
import { PortModel } from "../models/PortModel";
import { BaseWidget } from "./BaseWidget";
import { checkBlockDisabledLive } from "containers/Canvas/Blocks"

const toolkit = new Toolkit();

const reorder = (list, newIndex, item) => {
	const remainingItems = _.filter(list, i => i.id !== item.id);

	return [
		...remainingItems.slice(0, newIndex),
		item,
		...remainingItems.slice(newIndex)
	];
};
export class DiagramWidget extends BaseWidget {
	constructor(props) {
		super("srd-diagram", props);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.state = {
			action: null,
			wasMoved: false,
			renderedNodes: false,
			windowListener: null,
			diagramEngineListener: null,
			document: null
		};
		this.repaint = false;
		this.onDeleteConfirm = this.onDeleteConfirm.bind(this)
		this.clickDiagram = this.clickDiagram.bind(this)
	}

	componentWillUnmount() {
		this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
		this.props.diagramEngine.setCanvas(null);
		window.removeEventListener("keyup", this.onKeyUpPointer);
		window.removeEventListener("mouseUp", this.onMouseUp);
		window.removeEventListener("mouseMove", this.onMouseMove);
	}

	componentWillReceiveProps(nextProps) {
		if (this.props.diagramEngine !== nextProps.diagramEngine) {
			this.props.diagramEngine.removeListener(this.state.diagramEngineListener);
			const diagramEngineListener = nextProps.diagramEngine.addListener({
				repaintCanvas: () => {
					this.repaint = true
					this.forceUpdate()
				}
			});
			this.setState({ diagramEngineListener });
		}
	}

	componentWillUpdate(nextProps) {
		if (this.props.diagramEngine.diagramModel.id !== nextProps.diagramEngine.diagramModel.id) {
			this.setState({ renderedNodes: false });
			nextProps.diagramEngine.diagramModel.rendered = true;
		}
		if (!nextProps.diagramEngine.diagramModel.rendered) {
			this.setState({ renderedNodes: false });
			nextProps.diagramEngine.diagramModel.rendered = true;
		}
	}

	componentDidUpdate() {
		if (!this.state.renderedNodes) {
			this.setState({
				renderedNodes: true
			});
		}

		const nodes = this.props.diagramEngine.getDiagramModel().getNodes()
		_.forEach(nodes, node => {
			node.centerLinks(this.props.diagramEngine)
		})
	}

	componentDidMount() {
		this.onKeyUpPointer = this.onKeyUp.bind(this);

		//add a keyboard listener
		this.setState({
			document: document,
			renderedNodes: true,
			diagramEngineListener: this.props.diagramEngine.addListener({
				repaintCanvas: (clear_entities) => {
					if (clear_entities) {
						this.repaint = true
					}
					this.forceUpdate();
				}
			})
		});

		window.addEventListener("keyup", this.onKeyUpPointer, false);

		// dont focus the window when in test mode - jsdom fails
		if (process.env.NODE_ENV !== "test") {
			window.focus();
		}
	}

	/**
	 * Gets a model and element under the mouse cursor
	 */
	getMouseElement(event) {
		var target = event.target;
		var diagramModel = this.props.diagramEngine.diagramModel;
		//is it a port
		var element = toolkit.closest(target, ".port[data-name]");
		if (element) {
			var nodeElement = toolkit.closest(target, ".node[data-nodeid]");
			if (!diagramModel.getNode(nodeElement.getAttribute("data-nodeid"))) {
				let combine_nodes = []
				_.forEach(diagramModel.nodes, node => {
					combine_nodes = combine_nodes.concat(node.combines);
				})
				let newNode = combine_nodes[nodeElement.getAttribute("data-nodeid")]
				if (newNode) {
					newNode = newNode.ports[element.getAttribute("data-name")];
					return {
						model: newNode,
						element: element
					}
				} else {
					return {
						model: null,
						element: element
					}
				}
			}
			nodeElement = toolkit.closest(target, '.srd-default-node[data-nodeid]')
			if (!diagramModel.getNode(nodeElement.getAttribute("data-nodeid"))) {
				let combine_nodes = []
				_.forEach(diagramModel.nodes, node => {
					combine_nodes = combine_nodes.concat(node.combines);
				})
				let newNode = _.find(combine_nodes, c => c.id === nodeElement.getAttribute("data-nodeid"))
				if (newNode) {
					newNode = _.find(newNode.ports, p => p.name === element.getAttribute("data-name"));
					return {
						model: newNode,
						element: element
					}
				} else {
					return {
						model: null,
						element: element
					}
				}
			}
			let port = diagramModel
				.getNode(nodeElement.getAttribute("data-nodeid"))
				.getPort(element.getAttribute("data-name"))
			if (!port) {
				port = _.find(diagramModel.getNode(nodeElement.getAttribute("data-nodeid")).ports, dp => dp.name === element.getAttribute("data-name"));
			}
			return {
				model: port,
				element: element
			};
		}

		//look for a point
		element = toolkit.closest(target, ".point[data-id]");
		if (element) {
			return {
				model: diagramModel
					.getLink(element.getAttribute("data-linkid"))
					.getPointModel(element.getAttribute("data-id")),
				element: element
			};
		}

		//look for a link
		element = toolkit.closest(target, "[data-linkid]");
		if (element) {
			return {
				model: diagramModel.getLink(element.getAttribute("data-linkid")),
				element: element
			};
		}

		//look for a node
		element = toolkit.closest(target, ".node[data-nodeid]");
		if (element) {
			return {
				model: diagramModel.getNode(element.getAttribute("data-nodeid")),
				element: element
			};
		}
		return null;
	}

	fireAction() {
		if (this.state.action && this.props.actionStillFiring) {
			this.props.actionStillFiring(this.state.action);
		}
	}

	stopFiringAction(shouldSkipEvent) {
		if (this.props.actionStoppedFiring && !shouldSkipEvent) {
			this.props.actionStoppedFiring(this.state.action);
		}
		this.setState({ action: null });
	}

	startFiringAction(action) {
		var setState = true;
		if (this.props.actionStartedFiring) {
			setState = this.props.actionStartedFiring(action);
		}
		if (setState) {
			this.setState({ action: action });
		}
	}

	clickDiagram(e) {
		let engine = this.props.diagramEngine
		let selected = engine.getDiagramModel().getSelectedItems("node")
		if (!_.isEmpty(selected) && _.first(selected).extras && _.first(selected).extras.type === 'story') {
			if (engine.getSuperSelect().extras.type !== 'story'){
				selected = [engine.getSuperSelect()]
			}
		}
		if (selected.length === 1 && selected[0]) {
			if (selected[0].extras.type === 'comment') {
				this.diagram_focus = false
			} else if (selected[0].extras.type !== 'story') {
				this.props.setOpen(true)
				if (selected[0].combines && selected[0].combines.length === 0) {
					engine.setSuperSelect(selected[0])
				}
			}
			else {
				this.props.setOpen(false)
			}
		} else if (selected.length === 0) {
			engine.setSuperSelect(null)
			let model = engine.getDiagramModel()
			let nodes = model.getNodes()
			for (let key in nodes) {
				if (nodes[key].extras.type === 'comment' && nodes[key].name.trim().length === 0) {
					model.removeNode(nodes[key].getID())
					this.forceUpdate()
				}
			}
		}
		// this.props.setBlockMenu(null)
	}

	onMouseMove(event) {
		var diagramModel = this.props.diagramEngine.getDiagramModel();
		//select items so draw a bounding box
		if (this.state.action instanceof SelectingAction) {
			var relative = this.props.diagramEngine.getRelativePoint(event.clientX, event.clientY);

			_.forEach(diagramModel.getNodes(), node => {
				if ((this.state.action).containsElement(node.x, node.y, diagramModel)) {
					node.setSelected(true);
				}
			});

			_.forEach(diagramModel.getLinks(), link => {
				var allSelected = true;
				_.forEach(link.points, point => {
					if ((this.state.action).containsElement(point.x, point.y, diagramModel)) {
						point.setSelected(true);
					} else {
						allSelected = false;
					}
				});

				if (allSelected) {
					link.setSelected(true);
				}
			});

			this.state.action.mouseX2 = relative.x;
			this.state.action.mouseY2 = relative.y;

			this.fireAction();
			this.setState({ action: this.state.action });
			return;
		} else if (this.state.action instanceof MoveItemsAction) {
			let amountX = event.clientX - this.state.action.mouseX;
			let amountY = event.clientY - this.state.action.mouseY;
			if (amountX === 0 && amountY === 0) return;
			let amountZoom = diagramModel.getZoomLevel() / 100;
			// console.log(this.state.action.selectionModels)
			_.forEach(this.state.action.selectionModels, model => {
				// in this case we need to also work out the relative grid position
				if (
					model.model instanceof NodeModel ||
					(model.model instanceof PointModel && !model.model.isConnectedToPort())
				) {
					model.model.x = diagramModel.getGridPosition(model.initialX + amountX / amountZoom);
					model.model.y = diagramModel.getGridPosition(model.initialY + amountY / amountZoom);
					// this.props.diagramEngine.getDiagramModel().clearSelection();
					model.model.setSelected(true);
					// update port coordinates as well
					if (model.model instanceof NodeModel) {
						if (event.buttons === 1 && this.props.diagramEngine.getSuperSelect()) {
							model.element.style.pointerEvents = 'none';
						}
						_.forEach(model.model.getPorts(), port => {
							const portCoords = this.props.diagramEngine.getPortCoords(port);
							port.updateCoords(portCoords);
						});
						// Update combines
						let current = model.model;
						let target_node = current.parentCombine;
						if (Math.abs(amountX) > 2 || Math.abs(amountY) > 2) {
							current.isMoving = true;
						}
						if (current && target_node && (Math.abs(amountX) > 5 || Math.abs(amountY) > 5)) {
							_.remove(target_node.combines, (n, idx) => {
								if (n.id === current.id) {
									target_node.combines.splice(idx + 1, 0, 'temp')
									return true;
								}
							})
							current.isMoveInside = true;
							this.props.diagramEngine.getDiagramModel().addNode(current);
							this.props.diagramEngine.enableRepaintEntities([current]);
							this.props.diagramEngine.repaintCanvas(false)
							let overlapX = (current.x >= target_node.x && current.x <= (target_node.x + target_node.width / amountZoom)) || (current.x + 220 >= target_node.x && current.x + 220 <= target_node.x + (target_node.width / amountZoom));
							let overlapY = (current.y >= target_node.y && current.y <= target_node.y + target_node.height / amountZoom) || (current.y + 35 >= target_node.y && current.y + 35 <= target_node.y + target_node.height / amountZoom);
							if (!overlapX || !overlapY) {
								current.isMoveInside = false;
								if (target_node.combines.length <= 2) {
									let nodeCount = 0;
									let firstNode = 0;
									_.forEach(target_node.combines, (c, idx) => {
										if (c.id) {
											nodeCount++;
											firstNode = idx;
										}
									});
									if (nodeCount === 1) {
										let removed = target_node.combines[firstNode];
										this.props.diagramEngine.getDiagramModel().addNode(removed)
										removed.parentCombine = null;
										removed.extras.nextID = null;
										target_node.remove(false);
									}
								}
								let tempIdx;
								_.remove(target_node.combines, (c, idx) => {
									if (c === 'temp') {
										tempIdx = idx;
										return true;
									}
								})
								if (tempIdx === current.parentCombine.combines.length) {
									_.forEach(current.parentCombine.ports, cp => {
										if (cp && !cp.in) {
											current.parentCombine.removePort(current.parentCombine.ports[cp.name]);
										}
									})
									_.forEach(current.ports, cp => cp.parent = current);
									let lastNode = _.last(current.parentCombine.combines)
									lastNode = new BlockNodeModel().deSerialize(lastNode, this.props.diagramEngine, null, false, [], true);
									_.forEach(lastNode.ports, lp => {
										if (!lp.in) {
											lp.parent = current.parentCombine
											current.parentCombine.ports[lp.name] = lp;
										}
									})
								} else {
									_.map(current.parentCombine.getOutPorts(), port => {
										if (!_.isEmpty(port.links) && port instanceof PortModel) {
											let pointIdx = _.findIndex(_.first(_.values(port.links)).points, p => p.parent.sourcePort.id === port.id)
											let point = _.first(_.values(port.links)).points[pointIdx]
											if (point instanceof PointModel && current.parentCombine.ports[port.name]) {
												current.parentCombine.ports[port.name].links[point.parent.id].points[pointIdx].updateLocation({ x: point.x, y: point.y - 40 });
											}
										}
									})
								}
								current.parentCombine = null;
								current.extras.nextID = null;
								this.props.diagramEngine.getDiagramModel().clearSelection()
								this.props.diagramEngine.setSuperSelect(null)
								this.props.forceRepaint()
							} else {
								let nodeIdx = _.findIndex(target_node.combines, c => c === 'temp')
								if (nodeIdx >= 0 && current.extras.type !== 'exit' && current.extras.type !== 'choice' && current.extras.type !== 'stream' && current.extras.type !== 'random' && current.extras.type !== 'interaction' && current.extras.type !== 'if') {
									if (nodeIdx !== 0) {
										let prevNode = target_node.combines[nodeIdx - 1]
										if ((current.y < prevNode.y) && (prevNode !== 'temp')) {
											prevNode.y = prevNode.y + current.height / amountZoom;
											target_node.combines = reorder(target_node.combines, nodeIdx - 1, 'temp');
											this.props.diagramEngine.enableRepaintEntities([target_node]);
											this.props.diagramEngine.repaintCanvas(false)
										}
									}
									if (nodeIdx !== target_node.combines.length - 1) {
										let nextNode = target_node.combines[nodeIdx + 1];
										if ((current.y > nextNode.y) && (nextNode !== 'temp')
											&& (nextNode.extras.type !== 'choice' && nextNode.extras.type !== 'exit' && nextNode.extras.type !== 'stream' && nextNode.extras.type !== 'random' && nextNode.extras.type !== 'interaction' && nextNode.extras.type !== 'if')) {
											nextNode.y = nextNode.y - current.height / amountZoom;
											target_node.combines = reorder(target_node.combines, nodeIdx + 1, 'temp');
											this.props.diagramEngine.enableRepaintEntities([target_node]);
											this.props.diagramEngine.repaintCanvas(false)
										}
									}
								}
							}
						}
					}

					if (this.props.diagramEngine.isSmartRoutingEnabled()) {
						this.props.diagramEngine.calculateRoutingMatrix();
					}
				}
			});

			if (this.props.diagramEngine.isSmartRoutingEnabled()) {
				this.props.diagramEngine.calculateCanvasMatrix();
			}

			this.fireAction();
			if (!this.state.wasMoved) {
				this.setState({ wasMoved: true });
			} else {
				this.forceUpdate();
			}
		} else if (this.state.action instanceof MoveCanvasAction) {

			// diagramEngine.startMove();

			//translate the actual canvas
			if (this.props.allowCanvasTranslation) {
				diagramModel.setOffset(
					this.state.action.initialOffsetX + (event.clientX - this.state.action.mouseX),
					this.state.action.initialOffsetY + (event.clientY - this.state.action.mouseY)
				);
				this.fireAction();
				this.forceUpdate();
			}
		}
	}

	onDeleteConfirm = (selectedItems) => {
		_.forEach(selectedItems, element => {
			if (!this.props.diagramEngine.isModelLocked(element) && !element.locked) {
				let elements_to_not_delete = []
				// let inPorts = _.filter(element.ports, p => !p.in)
				// Filter which elements to not delete and deserialize
				for (let i in element.combines) {
					let new_node = new BlockNodeModel().deSerialize(element.combines[i], this.props.diagramEngine, null, false, [], true)
					// new_node.getInPorts().links = inPorts.links
					if (checkBlockDisabledLive(this.props.live_mode, new_node.extras.type)) {
						elements_to_not_delete.push(new_node)
					}
				}

				_.forEach(elements_to_not_delete, good_element => this.props.diagramEngine.getDiagramModel().addNode(good_element))
				element.remove()
			}
		})
	}

	onKeyUp(event) {
		if (this.props.locked) return;
		//delete all selected
		if (this.props.deleteKeys.indexOf(event.keyCode) !== -1) {
			let selectedItems = this.props.diagramEngine.getDiagramModel().getSelectedItems()
			let diagramEngine = this.props.diagramEngine;
			let first = selectedItems[0]
			let super_select = diagramEngine.getSuperSelect()
			if (first && first.extras && first.combines && first.combines.length !== 0 && super_select && super_select.parentCombine
				&& super_select.extras && super_select.combines && super_select.combines !== 0) {
				diagramEngine.getDiagramModel().clearSelection()
				selectedItems = [diagramEngine.getSuperSelect()]
				this.props.nodeProps.removeCombineNode(super_select)
			}
			if (selectedItems && selectedItems.length > 0 && !_.some(selectedItems, { locked: true })) {
				this.props.removeHandler(selectedItems)
				_.forEach(selectedItems, element => {
					if (
						!element.isLocked()
					) {
						diagramEngine.setSuperSelect(null)
						this.props.forceRepaint()
						if (element instanceof BlockNodeModel && element.extras.type === 'story') {
							diagramEngine.setSuperSelect(null)
							this.props.forceRepaint()
						}
						if (element.extras && (element.extras.type === 'comment' || element.extras.type === 'story')) {
							element.clearListeners()
							element.addListener({ entityRemoved: e => e.stopPropagation() })
						} else if (element.extras && element.extras.type === 'intent') {
							this.props.onDeleteIntentNode(element);
						} else if (element.extras && element.extras.type === 'god') {
							this.props.onConfirm({
								warning: true,
								text: <Alert color="danger" className="mb-0">WARNING: This action can not be undone, <i>{element.name}</i> can not be recovered</Alert>,
								confirm: this.onDeleteConfirm,
								params: [selectedItems, element]
							})
						} else if (element instanceof BlockNodeModel && element.extras && !checkBlockDisabledLive(this.props.live_mode, element.extras.type)) {
							if (element.extras.type !== 'story') {
								diagramEngine.setSuperSelect(null);
								element.remove()
							}
						} else if (!(element instanceof BlockNodeModel)) {
							if (element instanceof PointModel && (element.parent.sourcePort.parent && (element.parent.sourcePort.parent.extras.type !== 'story' || element.parent.points.length > 2))) {
								element.remove()
							}
						}
					}
				});
				this.forceUpdate();
			}
		}
	}

	onMouseUp(event) {
		var diagramEngine = this.props.diagramEngine;
		diagramEngine.stopMove();
		//are we going to connect a link to something?
		if (this.state.action instanceof MoveItemsAction) {
			var element = this.getMouseElement(event);
			_.forEach(this.state.action.selectionModels, model => {
				//only care about points connecting to things
				if (model.model instanceof BlockNodeModel) {
					if (!model.model.isMoving || this.props.editorOpen) {
						this.clickDiagram()
					}
					model.element.style.pointerEvents = 'all';
					model.model.isMoving = false;
					if (model.model.extras.type === 'god') {
						let totalHeight = 40;
						_.forEach(model.model.combines, (c, idx) => {
							if (!(c instanceof String) && c.id !== model.model.id) {
								c.x = model.model.x + 10;
								c.y = model.model.y + totalHeight;
								if (c.height) {
									totalHeight = totalHeight + c.height
								} else {
									const dimensions = diagramEngine.getNodeDimensions(c);
									c.updateDimensions(dimensions)
									totalHeight = totalHeight + dimensions.height
								}
							}
						});
					}
				}
				if (!(model.model instanceof PointModel)) {
					return;
				}
				if (element && element.model instanceof PortModel && !diagramEngine.isModelLocked(element.model)) {
					let link = model.model.getLink();
					if (link.getTargetPort() !== null) {
						//if this was a valid link already and we are adding a node in the middle, create 2 links from the original
						if (link.getTargetPort() !== element.model && link.getSourcePort() !== element.model) {
							const targetPort = link.getTargetPort();
							let newLink = link.clone({});
							newLink.setSourcePort(element.model);
							newLink.setTargetPort(targetPort);
							link.setTargetPort(element.model);
							targetPort.removeLink(link);
							newLink.removePointsBefore(newLink.getPoints()[link.getPointIndex(model.model)]);
							link.removePointsAfter(model.model);
							diagramEngine.getDiagramModel().addLink(newLink);
							//if we are connecting to the same target or source, remove tweener points
						} else if (link.getTargetPort() === element.model) {
							link.removePointsAfter(model.model);
						} else if (link.getSourcePort() === element.model) {
							link.removePointsBefore(model.model);
						}
					} else {
						link.setTargetPort(element.model);
					}
					delete this.props.diagramEngine.linksThatHaveInitiallyRendered[link.getID()];
				}
				if (model.model instanceof PointModel && model.model.parent.sourcePort && model.model.parent.targetPort) {
					if (!model.model.parent.hidden && _.last(model.model.parent.points).id === model.model.id) {
						let target = this.props.diagramEngine.getPortCenter(model.model.parent.targetPort)
						model.model.updateLocation(target)
					} else if (!model.model.parent.hidden && _.head(model.model.parent.points).id === model.model.id) {
						let source = this.props.diagramEngine.getPortCenter(model.model.parent.sourcePort)
						model.model.updateLocation(source)
					}
				}
			});
			//check for / remove any loose links in any models which have been moved
			if (!this.props.allowLooseLinks) {
				_.forEach(this.state.action.selectionModels, model => {
					//only care about points connecting to things
					if (!(model.model instanceof PointModel)) {
						return;
					}

					let selectedPoint = model.model;
					let link = selectedPoint.getLink();
					if (link.getSourcePort() === null || link.getTargetPort() === null) {
						link.remove();
					}
				});
			}

			//remove any invalid links
			_.forEach(this.state.action.selectionModels, model => {
				//only care about points connecting to things
				if (!(model.model instanceof PointModel)) {
					return;
				}

				let link = model.model.getLink();
				let sourcePort = link.getSourcePort();
				let targetPort = link.getTargetPort();
				if (sourcePort !== null && targetPort !== null) {
					if (!sourcePort.canLinkToPort(targetPort)) {
						//link not allowed
						link.remove();
					} else if (
						_.some(
							_.values(targetPort.getLinks()),
							(l) =>
								l !== link && (l.getSourcePort() === sourcePort || l.getTargetPort() === sourcePort)
						)
					) {
						//link is a duplicate
						link.remove();
					}
				}
			});
			this.stopFiringAction(!this.state.wasMoved);
		} else {
			this.stopFiringAction();
			this.props.setOpen(false)
			if (diagramEngine.getSuperSelect()) {
				diagramEngine.getSuperSelect().setSelected(false)
				diagramEngine.setSuperSelect(null)
				this.props.forceRepaint();
			}
		}
		this.state.document.removeEventListener("mousemove", this.onMouseMove);
		this.state.document.removeEventListener("mouseup", this.onMouseUp);
	}

	drawSelectionBox() {
		let dimensions = (this.state.action).getBoxDimensions();
		return (
			<div
				className={this.bem("__selector")}
				style={{
					top: dimensions.top,
					left: dimensions.left,
					width: dimensions.width,
					height: dimensions.height
				}}
			/>
		);
	}

	render() {
		var diagramEngine = this.props.diagramEngine;
		diagramEngine.setMaxNumberPointsPerLink(this.props.maxNumberPointsPerLink);
		diagramEngine.setSmartRoutingStatus(this.props.smartRouting);
		var diagramModel = diagramEngine.getDiagramModel();

		if (this.repaint) {
			diagramEngine.clearRepaintEntities()
			diagramEngine.stopMove()
			this.repaint = false
		}

		return (
			<div
				{...this.getProps()}
				ref={ref => {
					if (ref) {
						this.props.diagramEngine.setCanvas(ref);
					}
				}}
				onWheel={event => {
					diagramEngine.clearRepaintEntities();
					diagramEngine.startMove();

					// if (this.props.allowCanvasZoom) {
					event.preventDefault();
					event.stopPropagation();
					const oldZoomFactor = diagramModel.getZoomLevel() / 100;
					let scrollDelta = this.props.inverseZoom ? -event.deltaY : event.deltaY;
					//check if it is pinch gesture
					if (event.ctrlKey && scrollDelta % 1 !== 0) {
						/*Chrome and Firefox sends wheel event with deltaY that
							have fractional part, also `ctrlKey` prop of the event is true
							though ctrl isn't pressed
						*/
						scrollDelta /= 3;
					} else {
						scrollDelta /= 60;
					}
					if (diagramModel.getZoomLevel() + scrollDelta > 10) {
						diagramModel.setZoomLevel(diagramModel.getZoomLevel() + scrollDelta);
					}

					const zoomFactor = diagramModel.getZoomLevel() / 100;

					const boundingRect = event.currentTarget.getBoundingClientRect();
					const clientWidth = boundingRect.width;
					const clientHeight = boundingRect.height;
					// compute difference between rect before and after scroll
					const widthDiff = clientWidth * zoomFactor - clientWidth * oldZoomFactor;
					const heightDiff = clientHeight * zoomFactor - clientHeight * oldZoomFactor;
					// compute mouse coords relative to canvas
					const clientX = event.clientX - boundingRect.left;
					const clientY = event.clientY - boundingRect.top;

					// compute width and height increment factor
					const xFactor = (clientX - diagramModel.getOffsetX()) / oldZoomFactor / clientWidth;
					const yFactor = (clientY - diagramModel.getOffsetY()) / oldZoomFactor / clientHeight;

					diagramModel.setOffset(
						diagramModel.getOffsetX() - widthDiff * xFactor,
						diagramModel.getOffsetY() - heightDiff * yFactor
					);

					// diagramEngine.enableRepaintEntities([]);
					this.forceUpdate();
					// }
				}}
				onMouseDown={event => {
					this.props.setBlockMenu(null);
					if (event.nativeEvent.which === 3) return;
					this.setState({ ...this.state, wasMoved: false });
					diagramEngine.stopMove();
					// diagramEngine.clearRepaintEntities();
					var model = this.getMouseElement(event);
					var relative;
					//the canvas was selected
					if (model === null) {
						diagramEngine.clearRepaintEntities();
						//is it a multiple selection
						if (event.shiftKey) {
							relative = diagramEngine.getRelativePoint(event.clientX, event.clientY);
							this.startFiringAction(new SelectingAction(relative.x, relative.y));
						} else {
							diagramEngine.startMove();
							//its a drag the canvas event
							diagramModel.clearSelection();
							this.startFiringAction(new MoveCanvasAction(event.clientX, event.clientY, diagramModel));
						}
					} else if (model.model instanceof PortModel) {
						diagramEngine.enableRepaintEntities(diagramModel.getSelectedItems());
						//its a port element, we want to drag a link
						if (!this.props.diagramEngine.isModelLocked(model.model) && !model.model.in) {
							relative = diagramEngine.getRelativeMousePoint(event);
							var sourcePort = model.model;
							var link = sourcePort.createLinkModel();
							link.setSourcePort(sourcePort);

							if (link) {
								link.removeMiddlePoints();
								if (link.getSourcePort() !== sourcePort) {
									link.setSourcePort(sourcePort);
								}
								link.setTargetPort(null);

								link.getFirstPoint().updateLocation(relative);
								link.getLastPoint().updateLocation(relative);

								diagramModel.clearSelection();
								link.getLastPoint().setSelected(true);
								diagramModel.addLink(link);
								this.startFiringAction(
									new MoveItemsAction(event.clientX, event.clientY, diagramEngine, event, this.props.locked)
								);
							}
						} else {
							diagramModel.clearSelection();
						}
					} else {
						diagramEngine.enableRepaintEntities(diagramModel.getSelectedItems());
						//its some or other element, probably want to move it
						if (!event.shiftKey && model.model && !model.model.isSelected()) {
							diagramModel.clearSelection();
						}
						model.model.setSelected(true);
						this.startFiringAction(new MoveItemsAction(event.clientX, event.clientY, diagramEngine, event, this.props.locked));
					}
					this.state.document.addEventListener("mousemove", this.onMouseMove);
					this.state.document.addEventListener("mouseup", this.onMouseUp);
					event.didRun = false;
					// event.stopPropagation()
				}}
			>
				{this.state.renderedNodes && (
					<LinkLayerWidget
						diagramEngine={diagramEngine}
						pointAdded={(point, event) => {
							this.state.document.addEventListener("mousemove", this.onMouseMove);
							this.state.document.addEventListener("mouseup", this.onMouseUp);
							event.stopPropagation();
							diagramModel.clearSelection(point);
							this.setState({
								action: new MoveItemsAction(event.clientX, event.clientY, diagramEngine, event, this.props.locked)
							});
						}}
					/>
				)}
				<NodeLayerWidget
					diagramEngine={diagramEngine}
					nodeProps={this.props.nodeProps}
				/>
				{this.state.action instanceof SelectingAction && this.drawSelectionBox()}
			</div>
		);
	}
}

DiagramWidget.defaultProps = {
	diagramEngine: null,
	allowLooseLinks: true,
	allowCanvasTranslation: true,
	allowCanvasZoom: true,
	inverseZoom: false,
	maxNumberPointsPerLink: Infinity, // backwards compatible default
	smartRouting: false,
	deleteKeys: [46, 8]
}

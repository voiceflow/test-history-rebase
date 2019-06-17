import { BaseEntity } from "../BaseEntity";
import * as _ from "lodash";
import { LinkModel } from "./LinkModel";
import { NodeModel } from "./NodeModel";
import { PortModel } from "./PortModel";
import { PointModel } from "./PointModel";
/**
 * @author Dylan Vorster
 *
 */
// export interface DiagramListener extends BaseListener {
// 	nodesUpdated?(event: BaseEvent & { node: NodeModel; isCreated: boolean }): void;
//
// 	linksUpdated?(event: BaseEvent & { link: LinkModel; isCreated: boolean }): void;
//
// 	offsetUpdated?(event: BaseEvent<DiagramModel> & { offsetX: number; offsetY: number }): void;
//
// 	zoomUpdated?(event: BaseEvent<DiagramModel> & { zoom: number }): void;
//
// 	gridUpdated?(event: BaseEvent<DiagramModel> & { size: number }): void;
// }
//
// /**
//  *
//  */
export class DiagramModel extends BaseEntity {
	constructor() {
		super();

		this.links = {};
		this.nodes = {};

		this.offsetX = 0;
		this.offsetY = 0;
		this.zoom = 100;
		this.rendered = false;
		this.gridSize = 0;
	}

	setGridSize(size = 0) {
		this.gridSize = size;
		this.iterateListeners((listener, event) => {
			if (listener.gridUpdated) {
				listener.gridUpdated({ ...event, size: size });
			}
		});
	}

	getGridPosition(pos) {
		if (this.gridSize === 0) {
			return pos;
		}
		return this.gridSize * Math.floor((pos + this.gridSize / 2) / this.gridSize);
	}

	deSerializeDiagram(object, diagramEngine) {
		this.deSerialize(object, diagramEngine);

		this.offsetX = object.offsetX;
		this.offsetY = object.offsetY;
		this.zoom = object.zoom;
		this.gridSize = 0;

		// deserialize nodes
		_.forEach(object.nodes, node => {
			let nodeOb = diagramEngine.getNodeFactory(node.type).getNewInstance(node);
			nodeOb.setParent(this);
			nodeOb.deSerialize(node, diagramEngine);
			this.addNode(nodeOb);
		});

		// deserialze links
		_.forEach(object.links, link => {
			let linkOb = diagramEngine.getLinkFactory(link.type).getNewInstance();
			linkOb.setParent(this);
			linkOb.deSerialize(link, diagramEngine);
			this.addLink(linkOb);
		});
	}

	serializeDiagram() {
		return _.merge(this.serialize(), {
			offsetX: this.offsetX,
			offsetY: this.offsetY,
			zoom: this.zoom,
			links: _.map(this.links, link => {
				return link.serialize();
			}),
			nodes: _.map(this.nodes, node => {
				return node.serialize();
			})
		});
	}

	clearSelection(ignore) {
		_.forEach(this.getSelectedItems(), element => {
			if (ignore && ignore.getID() === element.getID()) {
				return;
			}
			element.setSelected(false); //TODO dont fire the listener
		});
	}

	getSelectedItems(...filters) {
		if (!Array.isArray(filters)) {
			filters = [filters];
		}
		var items = [];

		// run through nodes
		items = items.concat(
			_.flatMap(this.nodes, node => {
				return node.getSelectedEntities();
			})
		);

		// find all the links
		items = items.concat(
			_.flatMap(this.links, link => {
				return link.getSelectedEntities();
			})
		);

		//find all points
		items = items.concat(
			_.flatMap(this.links, link => {
				return _.flatMap(link.points, point => {
					return point.getSelectedEntities();
				});
			})
		);
		items = _.uniq(items);

		if (filters.length > 0) {
			items = _.filter(_.uniq(items), (item) => {
				if (_.includes(filters, "node") && item instanceof NodeModel) {
					return true;
				}
				if (_.includes(filters, "link") && item instanceof LinkModel) {
					return true;
				}
				if (_.includes(filters, "port") && item instanceof PortModel) {
					return true;
				}
				if (_.includes(filters, "point") && item instanceof PointModel) {
					return true;
				}
				return false;
			});
		}

		return items;
	}

	setZoomLevel(zoom) {
		this.zoom = zoom;

		this.iterateListeners((listener, event) => {
			if (listener.zoomUpdated) {
				listener.zoomUpdated({ ...event, zoom: zoom });
			}
		});
	}

	setOffset(offsetX, offsetY, translate = false, diagramEngine = null) {
		clearInterval(this.offsetInterval)
		if (translate) {
			const deltaX = offsetX - this.offsetX;
			const deltaY = offsetY - this.offsetY;

			const accelerationX = 0.004 * deltaX;
			const accelerationY = 0.004 * deltaY;
			let vX = deltaX/100;
			let vY = deltaY/100;
			let counter = 20;
			this.offsetInterval = setInterval(() => {
				this.offsetX += vX;
				this.offsetY += vY;
				diagramEngine.repaintCanvas(false)
				counter -= 1;
				if (Math.abs(vX) < Math.abs(deltaX)) {
					vX += accelerationX;
				}
				if (Math.abs(vY) < Math.abs(deltaY)) {
					vY += accelerationY;
				}
				if ((this.offsetX === offsetX && this.offsetY === offsetY) || counter <= 0) {
					clearInterval(this.offsetInterval)
				}
			}, 1)
		} else {
			this.offsetX = offsetX;
			this.offsetY = offsetY
		}
		this.iterateListeners((listener, event) => {
			if (listener.offsetUpdated) {
				listener.offsetUpdated({ ...event, offsetX: offsetX, offsetY: offsetY });
			}
		});
	}

	setOffsetX(offsetX) {
		this.offsetX = offsetX;
		this.iterateListeners((listener, event) => {
			if (listener.offsetUpdated) {
				listener.offsetUpdated({ ...event, offsetX: offsetX, offsetY: this.offsetY });
			}
		});
	}
	setOffsetY(offsetY) {
		this.offsetY = offsetY;

		this.iterateListeners((listener, event) => {
			if (listener.offsetUpdated) {
				listener.offsetUpdated({ ...event, offsetX: this.offsetX, offsetY: this.offsetY });
			}
		});
	}

	getOffsetY() {
		return this.offsetY;
	}

	getOffsetX() {
		return this.offsetX;
	}

	getZoomLevel() {
		return this.zoom;
	}

	getNode(node) {
		if (node instanceof NodeModel) {
			return node;
		}
		let nodes = new Set()
		_.forEach(this.nodes, node => {
			if (!_.isEmpty(node.combines)) {
				_.forEach(node.combines, c => {
					nodes[c.id] = c
				})
			}
		})
		nodes = {
			...this.nodes,
			...nodes
		};
		if (!nodes[node]) {
			return null;
		}
		return nodes[node];
	}

	getLink(link) {
		if (link instanceof LinkModel) {
			return link;
		}
		if (!this.links[link]) {
			return null;
		}
		return this.links[link];
	}

	addAll(...models) {
		_.forEach(models, model => {
			if (model instanceof LinkModel) {
				this.addLink(model);
			} else if (model instanceof NodeModel) {
				this.addNode(model);
			}
		});
		return models;
	}

	addLink(link) {
		link.addListener({
			entityRemoved: () => {
				this.removeLink(link);
			}
		});
		this.links[link.getID()] = link;
		this.iterateListeners((listener, event) => {
			if (listener.linksUpdated) {
				listener.linksUpdated({ ...event, link: link, isCreated: true });
			}
		});
		return link;
	}

	addNode(node) {
		node.addListener({
			entityRemoved: () => {
				this.removeNode(node);
			}
		});
		this.nodes[node.getID()] = node;
		this.iterateListeners((listener, event) => {
			if (listener.nodesUpdated) {
				listener.nodesUpdated({ ...event, node: node, isCreated: true });
			}
		});
		return node;
	}

	removeLink(link) {
		link = this.getLink(link);
		delete this.links[link.getID()];
		this.iterateListeners((listener, event) => {
			if (listener.linksUpdated) {
				listener.linksUpdated({ ...event, link: link, isCreated: false });
			}
		});
	}

	removeNode(node) {
		node = this.getNode(node);
		if (node){
			delete this.nodes[node.getID()];
			this.iterateListeners((listener, event) => {
				if (listener.nodesUpdated) {
					listener.nodesUpdated({ ...event, node: node, isCreated: false });
				}
			});
		}
	}
	
	getLinks(){
		return this.links;
	}

	getNodes() {
		return this.nodes;
	}
}

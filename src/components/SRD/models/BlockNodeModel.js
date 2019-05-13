import _ from 'lodash';
import { DefaultNodeModel,Toolkit } from './../main.js'
import { BlockPortModel } from './BlockPortModel';
import memoizeOne from 'memoize-one'
import isEqual from 'views/helpers/react-fast-compare';

const toolkit = new Toolkit();

export class BlockNodeModel extends DefaultNodeModel {
	constructor(name = "Untitled", color = "rgb(0,192,255)", id, fade = false) {
		super(name, color, id);
		this.fade = fade
		this.linter = []
		this.deSerialize = this.deSerialize.bind(this)
		this.centerLinks = memoizeOne(this.centerLinks, isEqual).bind(this);
	}

	addInPort(label){
		return this.addPort(new BlockPortModel(true, toolkit.UID(), label, toolkit.UID()));
	}

	addOutPort(label){
		return this.addPort(new BlockPortModel(false, toolkit.UID(), label, toolkit.UID()));
	}

	deSerialize(object, engine, parentCombine=null, fade=false, linter=[], keepLink=false) {
			super.deSerialize(object, engine, keepLink);
			this.combines = object.combines ? _.map(object.combines,c => new BlockNodeModel().deSerialize(c, engine, this, false, [], true)) : [];
			this.parentCombine = parentCombine;
			this.fade = fade;
			this.linter = linter;
			return this;
	}

	setLocked(locked) {
		this.locked = locked;
		return this;
	}

	centerLinks(diagramEngine) {
		_.forEach(this.ports, port => {
			let center = diagramEngine.getPortCenter(port)
			_.forEach(port.links, link => {
				if (!_.isEmpty(link.points) && link.points.length >= 2) {
					if (!port.hidden) {
						if (port.in) {
							let point = _.last(link.points)
							point.updateLocation(center)
						} else {
							let point = _.head(link.points)
							point.updateLocation(center)
						}
					}
				} else {
					link.remove()
				}
			})
		})
	}
	clearOutLinks() {
		let ports = super.getOutPorts();
		_.forEach(ports, port => {
			_.forEach(port.links, link => {
				link.remove()
			})
		})
	}

	clearInLinks() {
		let ports = super.getInPorts();
		_.forEach(ports, port => {
			_.forEach(port.links, link => {
				link.remove()
			})
		})
	}
	isLocked(){
		return this.locked;
	}
	
	serialize() {
		return _.merge(super.serialize(), {
			combines: !_.isEmpty(this.combines) ? this.combines : null
		});
	}
	setSelected(selected) {
		super.setSelected(selected)
	}
	removePort(port) {
		//clear the parent node reference
		if (port instanceof BlockPortModel && this.ports[port.name]) {
			this.ports[port.name].setParent(null);
			let links = this.ports[port.name].getLinks();
			for(let key in links){
				links[key].remove();
			}
			delete this.ports[port.name];
		}
	}
}

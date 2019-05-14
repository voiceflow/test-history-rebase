import { Toolkit } from "./Toolkit.jsx";
import _ from "lodash";
// import { DiagramEngine } from "./DiagramEngine";
const toolkit = new Toolkit();
export class BaseEntity {
	constructor(id) {
		this.listeners = {};
		this.id = id;
		this.locked = false;
	}

	resetID() {
		this.id = toolkit.UID();
	}

	getID() {
		return this.id;
	}

	doClone(lookupTable, clone) {
		/*noop*/
	}

	clone(lookupTable) {
		// try and use an existing clone first
		if (lookupTable[this.id]) {
			return lookupTable[this.id];
		}
		let clone = _.clone(this);
		clone.id = toolkit.UID();
		clone.clearListeners();
		lookupTable[this.id] = clone;

		this.doClone(lookupTable, clone);
		return clone;
	}

	clearListeners() {
		this.listeners = {};
	}

	deSerialize(data, engine) {
		this.id = data.id;
	}

	serialize() {
		return {
			id: this.id
		};
	}

	iterateListeners(cb) {
		let event = {
			id: toolkit.UID(),
			firing: true,
			entity: this,
			stopPropagation: () => {
				event.firing = false;
			}
		};

		for (var i in this.listeners) {
			if (this.listeners.hasOwnProperty(i)) {
				// propagation stopped
				if (!event.firing) {
					return;
				}
				cb(this.listeners[i], event);
			}
		}
	}

	removeListener(listener) {
		if (this.listeners[listener]) {
			delete this.listeners[listener];
			return true;
		}
		return false;
	}

	addListener(listener) {
		var uid = toolkit.UID();
		this.listeners[uid] = listener;
		return uid;
	}

	isLocked() {
		return this.locked;
	}

	setLocked(locked = true) {
		this.locked = locked;
		this.iterateListeners((listener, event) => {
			if (listener.lockChanged) {
				listener.lockChanged({ ...event, locked: locked });
			}
		});
	}
}

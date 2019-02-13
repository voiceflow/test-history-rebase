const { BaseEntity } = require("../BaseEntity");
const _ = require('lodash')

export class BaseModel extends BaseEntity {
	constructor(type, id) {
		super(id);
		this.type = type;
		this.selected = false;
	}

	getParent() {
		return this.parent;
	}

	setParent(parent) {
		this.parent = parent;
	}

	getSelectedEntities() {
		if (this.isSelected()) {
			return [this];
		}
		return [];
	}

	deSerialize(ob, engine) {
		super.deSerialize(ob, engine);
		this.type = "default";
		this.selected = false;
	}

	serialize() {
		return super.serialize()
	}

	getType(): string {
		return this.type;
	}

	getID(): string {
		return this.id;
	}

	isSelected(): boolean {
		return this.selected;
	}

	setSelected(selected) {
		this.selected = selected;
		this.iterateListeners((listener, event) => {
			if (listener.selectionChanged) {
				listener.selectionChanged({ ...event, isSelected: selected });
			}
		});
	}

	remove() {
		this.iterateListeners((listener, event) => {
			if (listener.entityRemoved) {
				listener.entityRemoved(event);
			}
		});
	}
}

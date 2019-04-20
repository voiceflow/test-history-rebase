import { LinkModel, DefaultLinkModelListener, BaseEvent, DiagramEngine, DefaultLabelModel, LabelModel } from './../main.js';
export class BlockLinkModel extends LinkModel {
	constructor(type: string = "default", id, testing) {
		super(type, id, testing);
		this.color = "8DA2B5";
		this.width = 1;
		this.curvyness = 175;
		this.setSelected = this.setSelected.bind(this);
	}

	serialize() {
		return super.serialize()
	}
	
	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
	}

	addLabel(label: LabelModel | string) {
		if (label instanceof LabelModel) {
			return super.addLabel(label);
		}
		let labelOb = new DefaultLabelModel();
		labelOb.setLabel(label);
		return super.addLabel(labelOb);
	}

	setWidth(width: number) {
		this.width = width;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.widthChanged) {
				listener.widthChanged({ ...event, width: width });
			}
		});
	}

	setColor(color: string) {
		this.color = color;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.colorChanged) {
				listener.colorChanged({ ...event, color: color });
			}
		});
	}

	setSelected(selected: boolean) {
		this.selected = selected;
		this.iterateListeners((listener: DefaultLinkModelListener, event: BaseEvent) => {
			if (listener.selectedChanged) {
				listener.selectedChanged({ ...event, selected: selected });
			}
		});
	}

	setSourcePort(port: PortModel) {
		if (this.sourcePort !== null) {
			if(this.sourcePort.id === port.id){
				return;
			}
			this.sourcePort.removeLink(this);
		}
		if (port !== null) {
			port.addLink(this);
		}
		this.sourcePort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			if (listener.sourcePortChanged) {
				listener.sourcePortChanged({ ...event, port: port });
			}
		});
	}

	setTargetPort(port: PortModel) {
		if (!!this.targetPort) {
			this.targetPort.removeLink(this);
		}
		if (!!port) {
			port.addLink(this);
		}
		this.targetPort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			if (listener.targetPortChanged) {
				listener.targetPortChanged({ ...event, port: port });
			}
		});
	}
}

import { LinkModel, DefaultLinkModelListener, BaseEvent, DiagramEngine, DefaultLabelModel, LabelModel } from 'storm-react-diagrams';
import * as _ from "lodash";

export class BlockLinkModel extends LinkModel<DefaultLinkModelListener> {
	width: number;
	color: string;
	curvyness: number;

	constructor(type: string = "default") {
		super(type);
		this.color = "#555D6D";
		this.width = 1;
		this.curvyness = 50;
	}

	serialize() {
		return _.merge(super.serialize(), {
			width: this.width,
			color: this.color,
			curvyness: this.curvyness
		});
	}

	deSerialize(ob, engine: DiagramEngine) {
		super.deSerialize(ob, engine);
		this.color = ob.color;
		this.width = ob.width;
		this.curvyness = ob.curvyness;
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

	setSourcePort(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}

		if (this.sourcePort !== null) {
			if(this.sourcePort.id === port.id){
				return;
			}
			this.sourcePort.removeLink(this);
		}
		this.sourcePort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			if (listener.sourcePortChanged) {
				listener.sourcePortChanged({ ...event, port: port });
			}
		});
	}

	setTargetPort(port: PortModel) {
		if (port !== null) {
			port.addLink(this);
		}
		if (this.targetPort !== null) {
			this.targetPort.removeLink(this);
		}
		this.targetPort = port;
		this.iterateListeners((listener: LinkModelListener, event) => {
			if (listener.targetPortChanged) {
				listener.targetPortChanged({ ...event, port: port });
			}
		});
	}
}
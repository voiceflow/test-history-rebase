import * as React from "react";

import { DefaultLabelModel } from "../models/DefaultLabelModel";
import { DefaultLabelWidget } from "../widgets/DefaultLabelWidget";

/**
 * @author Dylan Vorster
 */
export class DefaultLabelFactory {
	constructor() {
		this.type = "default";
	}

	generateReactWidget(diagramEngine, label) {
		return <DefaultLabelWidget model={label} />;
	}

	getNewInstance(initialConfig){
		return new DefaultLabelModel();
	}

	getType(): string {
		return this.type;
	}
}

import React from "react";

import { DefaultNodeModel } from "../models/DefaultNodeModel";
import { DefaultNodeWidget } from "../widgets/DefaultNodeWidget";
/**
 * @author Dylan Vorster
 */
export class DefaultNodeFactory {
	constructor() {
		this.type = "default"
	}

	generateReactWidget(diagramEngine, node, repaint) {
		return React.createElement(DefaultNodeWidget, {
			node: node,
			diagramEngine: diagramEngine,
			repaint: repaint
		});
	}

	getNewInstance(initialConfig) {
		return new DefaultNodeModel();
	}

	getType(): string {
		return this.type;
	}
}

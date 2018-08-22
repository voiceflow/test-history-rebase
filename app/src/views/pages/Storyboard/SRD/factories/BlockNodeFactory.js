import { BlockNodeModel } from "./../models/BlockNodeModel";
import * as React from "react";
import { DiagramEngine, AbstractNodeFactory, DefaultNodeWidget } from "storm-react-diagrams";
/**
 * @author Dylan Vorster
 */
export class BlockNodeFactory extends AbstractNodeFactory<BlockNodeModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: BlockNodeModel): JSX.Element {
		return React.createElement(DefaultNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): BlockNodeModel {
		return new BlockNodeModel();
	}
}

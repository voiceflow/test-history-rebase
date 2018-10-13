import { BlockNodeModel } from "./../models/BlockNodeModel";
import * as React from "react";
import { BlockNodeWidget } from "./../widgets/BlockNodeWidget"
import { DiagramEngine, AbstractNodeFactory } from "storm-react-diagrams";
/**
 * @author Dylan Vorster
 */
export class BlockNodeFactory extends AbstractNodeFactory<BlockNodeModel> {
	constructor() {
		super("default");
	}

	generateReactWidget(diagramEngine: DiagramEngine, node: BlockNodeModel): JSX.Element {
		return React.createElement(BlockNodeWidget, {
			node: node,
			diagramEngine: diagramEngine
		});
	}

	getNewInstance(initialConfig?: any): BlockNodeModel {
		return new BlockNodeModel();
	}
}

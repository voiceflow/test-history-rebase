import { BlockNodeModel } from './../models/BlockNodeModel';
import * as React from 'react';
import { BlockNodeWidget } from './../widgets/BlockNodeWidget';
import { AbstractFactory } from './../main.js';
/**
 * @author Dylan Vorster
 */
export class BlockNodeFactory extends AbstractFactory {
  constructor() {
    super('default');
  }

  generateReactWidget(diagramEngine, node, repaint) {
    return React.createElement(BlockNodeWidget, {
      node: node,
      diagramEngine: diagramEngine,
      repaint: repaint,
    });
  }

  getNewInstance(initialConfig) {
    return new BlockNodeModel();
  }
}

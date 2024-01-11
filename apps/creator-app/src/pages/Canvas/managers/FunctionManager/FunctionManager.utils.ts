import { Markup } from '@voiceflow/dtos';
import { Descendant, Element, Node } from 'slate';

interface VariableNode {
  type: string;
  children: { text: string }[];
  variableID: string;
  variableVariant: string;
}

// Type guard to check if a Node is a VariableNode
const isVariableNode = (node: Node): node is VariableNode => Element.isElement(node) && node.type === 'variable' && 'variableID' in node;

// Function to find the first variable in a Descendant array
export const findFirstVariable = (descendants: Descendant[]): string | null => {
  for (const node of Node.descendants({ children: descendants } as Node)) {
    const [n] = node;

    if (isVariableNode(n)) {
      return n.variableID;
    }
  }
  return null;
};

export const createSlateVariable = (variableID: string | null): Markup => (variableID ? [{ text: [{ variableID }] }] : []);

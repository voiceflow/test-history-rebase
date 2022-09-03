import { BaseText } from '@voiceflow/base-types';
import { slate } from '@voiceflow/internal';
import { swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { Element, Text } from 'slate';

import { openURLInANewTab } from './window';

const serializeTextNode = (node: BaseText.Text, index: number): React.ReactNode => {
  const styles = slate.getTextCSSProperties(node);

  return (
    <span key={index} style={styles}>
      {node.text || <>&#xFEFF;</>}
    </span>
  );
};

const serializeLinkElement = (node: BaseText.LinkElement, index: number): React.ReactNode => {
  const children = node.children.map(serializeNode);
  const styles = slate.getElementCSSProperties(node);

  return (
    <a
      key={index}
      rel="noopener noreferrer"
      href={node.url ?? ''}
      target="_blank"
      style={{ ...styles, pointerEvents: 'all' }}
      onClick={swallowEvent(() => node.url && openURLInANewTab(node.url))}
    >
      {children}
    </a>
  );
};

const serializeVariableElement = (node: BaseText.VariableElement, index: number) => <span key={index}>{`{${node.name}}`}</span>;

const serializeElementNode = (node: BaseText.AnyElement, index: number): React.ReactNode => {
  if (slate.isLinkElement(node)) return serializeLinkElement(node, index);
  if (slate.isVariableElement(node)) return serializeVariableElement(node, index);

  const children = node.children.map(serializeNode);
  const styles = slate.getElementCSSProperties(node);

  return (
    <div key={index} style={styles}>
      {children}
    </div>
  );
};

const serializeNode = (node: BaseText.Descendant, index: number): React.ReactNode =>
  // eslint-disable-next-line no-nested-ternary
  Text.isText(node) ? serializeTextNode(node, index) : Element.isElement(node) ? serializeElementNode(node, index) : null;

export const transformSlateVariables = (value: BaseText.SlateTextValue): BaseText.SlateTextValue =>
  value.map((node) => {
    if (Element.isElement(node)) {
      return slate.isVariableElement(node) ? { text: `{${node.name}}` } : { ...node, children: transformSlateVariables(node.children) };
    }
    return node;
  });

export const serializeSlateToText = (content: BaseText.SlateTextValue): string => slate.toPlaintext(transformSlateVariables(content));

export const serializeSlateToJSX = (content: BaseText.SlateTextValue): React.ReactNode => content.map(serializeNode);

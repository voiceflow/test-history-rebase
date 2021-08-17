import { Text as BaseText } from '@voiceflow/base-types';
import { slate } from '@voiceflow/internal';
import { swallowEvent } from '@voiceflow/ui';
import React from 'react';
import { Text } from 'slate';

import { getValidHref } from './string';

const serializeTextNode = (node: BaseText.Text, index: number): React.ReactNode => {
  const styles = slate.getTextCSSProperties(node);

  return (
    <span key={index} style={styles}>
      {node.text}
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
      onClick={swallowEvent(() => node.url && window.open(getValidHref(node.url), '_blank'))}
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
  Text.isText(node) ? serializeTextNode(node, index) : serializeElementNode(node, index);

// eslint-disable-next-line import/prefer-default-export
export const serializeSlateToJSX = (content: BaseText.SlateTextValue): React.ReactNode => content.map(serializeNode);

import { JSColorStyle } from './types';

export const getJSCodeStyle = (options: { colors: JSColorStyle }) => ({
  hljs: {
    display: 'block',
    overflowX: 'auto',
    padding: '0.5em',
    background: options.colors.backgroundColor,
    color: '#ddd',
  },
  'hljs-keyword': {
    color: options.colors.variableToken,
  },
  'hljs-selector-tag': {
    color: options.colors.variableToken,
  },
  'hljs-literal': {
    color: options.colors.variableToken,
  },
  'hljs-section': {
    color: options.colors.variableToken,
  },
  'hljs-link': {
    color: 'white',
  },
  'hljs-subst': {
    color: '#ddd',
  },
  'hljs-string': {
    color: options.colors.strings,
  },
  'hljs-title': {
    color: options.colors.variableToken,
  },
  'hljs-name': {
    color: options.colors.variableToken,
    fontWeight: 'bold',
  },
  'hljs-type': {
    color: '#d88',
    fontWeight: 'bold',
  },
  'hljs-attribute': {
    color: '#d88',
  },
  'hljs-symbol': {
    color: '#d88',
  },
  'hljs-bullet': {
    color: '#d88',
  },
  'hljs-built_in': {
    color: '#d88',
  },
  'hljs-regexp': {
    color: options.colors.strings,
  },
  'hljs-addition': {
    color: '#d88',
  },
  'hljs-variable': {
    color: options.colors.variableToken,
  },
  'hljs-variable.constant': {
    color: options.colors.variableToken,
  },
  'hljs-template-tag': {
    color: '#d88',
  },
  'hljs-template-variable': {
    color: options.colors.variableToken,
  },
  'hljs-comment': {
    color: options.colors.statements,
  },
  'hljs-quote': {
    color: '#777',
  },
  'hljs-deletion': {
    color: '#777',
  },
  'hljs-meta': {
    color: '#777',
  },
  'hljs-doctag': {
    fontWeight: 'bold',
  },
  'hljs-strong': {
    fontWeight: 'bold',
  },
  'hljs-emphasis': {
    fontStyle: 'italic',
  },
});

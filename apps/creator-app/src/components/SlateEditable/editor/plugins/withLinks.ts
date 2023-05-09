import { Nullable } from '@voiceflow/common';
import { isLinkElement } from '@voiceflow/slate-serializer';
import { Descendant, Editor, Element, Location, Node, Point, Range, Text, Transforms } from 'slate';

import { ALL_URLS_REGEX } from '@/constants';
import { isAnyLink } from '@/utils/string';

import { DEFAULT_COLOR, ElementType, TextProperty } from '../../constants';
import type { EditorAPIType } from '../editorAPI';
import type { Color, LinkElement } from '../types';
import type { APIPlugin, Plugin } from './types';
import { matchAndProcessTextNodeToElement } from './utils';

const LINK_COLOR: Color = { r: 93, g: 157, b: 245, a: 1 };

export interface LinksEditorAPI {
  link: (editor: Editor) => Nullable<LinkElement>;
  isLink: (node: Descendant) => node is LinkElement;
  wrapLink: (editor: Editor, url: string, options?: { pasted?: boolean }) => void;
  unwrapLink: (editor: Editor) => void;
  applyLinkStyles: (editor: Editor, location: Location) => void;
  removeLinkStyles: (editor: Editor, location: Location) => void;
  identifyLinksInTextIfAny: (editor: Editor) => Nullable<[url: string, range: Range]>;
}

export const withLinksPlugin: Plugin = (EditorAPI: EditorAPIType) => (editor: Editor) => {
  const { isInline: originalIsInline, onChange: originalOnChange, normalizeNode: originalNormalizeNode } = editor;

  const addNodeStylesToChildrenNodes = (node: Node): Node => {
    if (Element.isElement(node) && EditorAPI.isVoid(editor, node)) {
      return node;
    }

    if (Text.isText(node)) {
      return {
        ...node,
        [TextProperty.COLOR]: node[TextProperty.COLOR] ?? LINK_COLOR,
        [TextProperty.UNDERLINE]: node[TextProperty.UNDERLINE] ?? true,
      };
    }

    return {
      ...node,
      children: node.children.map(addNodeStylesToChildrenNodes),
    };
  };

  editor.registerTextProcessingMiddleware(() => (next) => (nodes, { pasted, originalText }) => {
    const createLinkFromTextNode = (node: Text): LinkElement => ({
      type: ElementType.LINK,
      url: node.text,
      children: next([node]).map(addNodeStylesToChildrenNodes),
    });

    const { selection } = editor;

    if (pasted && selection && Range.isExpanded(selection) && isAnyLink(originalText)) {
      const selectedText = EditorAPI.string(editor, selection);

      return [createLinkFromTextNode({ text: selectedText })];
    }

    return nodes.flatMap((node) => {
      if (!Text.isText(node)) {
        return next([node]);
      }

      if (node.text && isAnyLink(node.text)) {
        return createLinkFromTextNode(node);
      }

      return matchAndProcessTextNodeToElement({ type: ElementType.LINK, node, next, regexp: ALL_URLS_REGEX }, (match, textNode) => [
        ...next([textNode]),
        createLinkFromTextNode({ text: match[0] }),
      ]);
    });
  });

  editor.isInline = (element) => (EditorAPI.isLink(element) ? true : originalIsInline(element));

  editor.onChange = () => {
    const linkRange = EditorAPI.identifyLinksInTextIfAny(editor);

    originalOnChange();

    if (linkRange) {
      // eslint-disable-next-line promise/catch-or-return, promise/always-return
      Promise.resolve().then(() => {
        const rangeRef = EditorAPI.rangeRef(editor, linkRange[1]);
        Transforms.wrapNodes(editor, { url: linkRange[0], type: ElementType.LINK, children: [] }, { at: linkRange[1], split: true });
        EditorAPI.applyLinkStyles(editor, rangeRef.current!);
        rangeRef.unref();
      });
    }
  };

  editor.normalizeNode = (entry) => {
    const [node, path] = entry;

    // if element is not link, run original normalization
    if (!Element.isElement(node) || !EditorAPI.isLink(node)) {
      originalNormalizeNode(entry);
      return;
    }

    // do nothing if children exists
    if (EditorAPI.serialize(node.children)) {
      return;
    }

    // remove empty link node
    Transforms.removeNodes(editor, { at: path });
  };

  return editor;
};

export const withLinksEditorApi: APIPlugin = (EditorAPI: EditorAPIType): EditorAPIType => {
  const LinksEditorAPI: LinksEditorAPI = {
    isLink: (node): node is LinkElement => Element.isElement(node) && isLinkElement(node),

    link: (editor): Nullable<LinkElement> => {
      const entry = Editor.above(editor, {
        at: editor.selection || EditorAPI.fullRange(editor),
        match: EditorAPI.isLink,
      });

      return entry?.[0] || null;
    },

    unwrapLink: (editor: Editor): void => {
      EditorAPI.withoutNormalizing(editor, () => {
        let selection = editor.selection || EditorAPI.fullRange(editor);

        if (Range.isCollapsed(selection)) {
          const entry = EditorAPI.above(editor, { at: selection, match: EditorAPI.isLink });

          if (entry) {
            const [node, path] = entry;

            selection = {
              anchor: { path, offset: 0 },
              focus: { path, offset: Node.string(node).length - 1 },
            };
          }
        }

        const selectionRef = EditorAPI.rangeRef(editor, selection);

        EditorAPI.removeLinkStyles(editor, selectionRef.current!);

        Transforms.unwrapNodes(editor, {
          at: selectionRef.current!,
          match: EditorAPI.isLink,
          mode: 'all',
          split: true,
          voids: true,
        });

        const nextFakeSelection = selectionRef.unref()!;

        if (editor.isFakeSelectionApplied()) {
          editor.setFakeSelectionRange(nextFakeSelection);
        }
      });
    },

    wrapLink: (editor: Editor, url: string, { pasted }: { pasted?: boolean } = {}): void => {
      EditorAPI.withoutNormalizing(editor, () => {
        let selection = editor.selection || EditorAPI.fullRange(editor);

        const selectionRef = EditorAPI.rangeRef(editor, selection);

        EditorAPI.unwrapLink(editor);

        if (Range.isCollapsed(selection) || (pasted && editor.selection)) {
          Transforms.insertNodes(
            editor,
            {
              url,
              type: ElementType.LINK,
              children: [{ text: url, [TextProperty.COLOR]: LINK_COLOR, [TextProperty.UNDERLINE]: true }],
            },
            { at: selectionRef.current! }
          );

          EditorAPI.removeMark(editor, TextProperty.COLOR);
          EditorAPI.removeMark(editor, TextProperty.UNDERLINE);
        } else {
          Transforms.wrapNodes(
            editor,
            {
              url,
              type: ElementType.LINK,
              children: [],
            },
            {
              at: selectionRef.current!,
              split: true,
              match: (node) => (Text.isText(node) && !editor.isFakeSelectionApplied()) || !!(node as Text)[EditorAPI.FAKE_SELECTION_PROPERTY_NAME],
            }
          );

          if (pasted) {
            Transforms.collapse(editor, { edge: 'end' });
          }

          EditorAPI.applyLinkStyles(editor, selectionRef.current!);
        }

        selection = selectionRef.unref()!;

        if (editor.isFakeSelectionApplied()) {
          editor.setFakeSelectionRange(selection);
        }
      });
    },

    applyLinkStyles: (editor: Editor, location: Location) => {
      EditorAPI.setTextPropertyAtLocation(editor, location, TextProperty.COLOR, LINK_COLOR);
      EditorAPI.setTextPropertyAtLocation(editor, location, TextProperty.UNDERLINE, true);
    },

    removeLinkStyles: (editor: Editor, location: Location) => {
      EditorAPI.setTextPropertyAtLocation(editor, location, TextProperty.COLOR, DEFAULT_COLOR);
      EditorAPI.setTextPropertyAtLocation(editor, location, TextProperty.UNDERLINE, false);
    },

    identifyLinksInTextIfAny: (editor: Editor) => {
      // if selection is not collapsed, we do not proceed with the link detection
      if (editor.selection == null || !Range.isCollapsed(editor.selection)) {
        return null;
      }

      const [node] = Editor.parent(editor, editor.selection);

      // if we are already inside a link, exit early.
      if (EditorAPI.isLink(node)) {
        return null;
      }

      const [currentNode, currentNodePath] = Editor.node(editor, editor.selection);

      // if we are not inside a text node, exit early.
      if (!Text.isText(currentNode)) {
        return null;
      }

      let [start]: [Nullable<Point>, Point] = Range.edges(editor.selection);
      const cursorPoint = start;

      const startPointOfLastCharacter = Editor.before(editor, editor.selection, { unit: 'character' });

      if (!startPointOfLastCharacter) {
        return null;
      }

      const lastCharacter = Editor.string(editor, Editor.range(editor, startPointOfLastCharacter, cursorPoint));

      if (lastCharacter !== ' ') {
        return null;
      }

      let end = startPointOfLastCharacter;

      start = Editor.before(editor, end, { unit: 'character' }) ?? null;

      const startOfTextNode = Editor.point(editor, currentNodePath, { edge: 'start' });

      while (start && Editor.string(editor, Editor.range(editor, start, end)) !== ' ' && !Point.isBefore(start, startOfTextNode)) {
        end = start;
        start = Editor.before(editor, end, { unit: 'character' }) ?? null;
      }

      const lastWordRange = Editor.range(editor, end, startPointOfLastCharacter);
      const lastWord = Editor.string(editor, lastWordRange);

      if (isAnyLink(lastWord)) {
        return [lastWord, lastWordRange];
      }

      return null;
    },
  };

  return Object.assign(EditorAPI, LinksEditorAPI);
};

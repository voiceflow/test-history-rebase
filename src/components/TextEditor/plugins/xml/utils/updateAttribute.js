import { EditorState, Modifier } from 'draft-js';

import { PushAction } from '../../constants';
import { getEntitySelection } from '../../utils/entities';
import getOpenTagText from './getOpenTagText';

const updateAttribute = (editorState, entityKey, { name, value }) => {
  let content = editorState.getCurrentContent();
  const entity = content.getEntity(entityKey);
  const selection = getEntitySelection(editorState, entity);
  const entityData = entity.getData();
  const attributes = { ...entityData.attributes, [name]: value };

  const tagText = getOpenTagText(entityData.tag, entityData.isSingle, attributes);

  content = content.mergeEntityData(entityKey, { text: tagText, attributes });

  content = Modifier.replaceText(content, selection, tagText, null, entityKey);

  return EditorState.push(editorState, content, PushAction.INSERT_CHARACTERS);
};

export default updateAttribute;

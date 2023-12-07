import { MediaDatatype } from '@voiceflow/dtos';
import { createSelector } from 'reselect';

import { isCardAttachment, isMediaAttachment } from '@/utils/attachments.util';

import { createDesignerCRUDSelectors, createDesignerSelector } from '../utils/selector.util';
import { STATE_KEY } from './attachment.state';

export const root = createDesignerSelector(STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } = createDesignerCRUDSelectors(root);

export const allCard = createSelector(all, (attachments) => attachments.filter(isCardAttachment));

export const allMedia = createSelector(all, (attachments) => attachments.filter(isMediaAttachment));

export const allMediaImageAssets = createSelector(allMedia, (attachments) =>
  attachments.filter((attachment) => attachment.datatype === MediaDatatype.IMAGE && attachment.isAsset)
);

export const oneMediaImageByID = createSelector(oneByID, (attachment) =>
  attachment && isMediaAttachment(attachment) && attachment.datatype === MediaDatatype.IMAGE ? attachment : null
);

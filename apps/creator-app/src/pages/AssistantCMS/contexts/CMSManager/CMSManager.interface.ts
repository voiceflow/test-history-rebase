import type {
  Entity,
  Event,
  Flow,
  Folder,
  FolderScope,
  Function as FunctionType,
  Intent,
  Prompt,
  Response,
  Variable,
  Workflow,
} from '@voiceflow/dtos';
import type { Atom, PrimitiveAtom } from 'jotai';

import type { State as AppState } from '@/ducks';
import type { KnowledgeBaseDocument } from '@/models/KnowledgeBase.model';
import type { Thunk } from '@/store/types';

export interface CMSFolder extends Folder {
  group: true;
}

export interface BaseCMSResource {
  group?: false;
}

export interface CMSFlow extends Flow, BaseCMSResource {}

export interface CMSEvent extends Event, BaseCMSResource {}

export interface CMSIntent extends Intent, BaseCMSResource {}

export interface CMSEntity extends Entity, BaseCMSResource {}

export interface CMSPrompt extends Prompt, BaseCMSResource {}

export interface CMSResponse extends Response, BaseCMSResource {}

export interface CMSWorkflow extends Workflow, BaseCMSResource {}

export interface CMSFunction extends FunctionType, BaseCMSResource {}

export interface CMSVariable extends Variable, BaseCMSResource {}

export interface CMSKnowledgeBase extends KnowledgeBaseDocument, BaseCMSResource {}

export type CMSResource =
  | CMSFlow
  | CMSEvent
  | CMSIntent
  | CMSEntity
  | CMSPrompt
  | CMSWorkflow
  | CMSResponse
  | CMSFunction
  | CMSVariable
  | CMSKnowledgeBase;

export type CMSFolderSelector = (state: AppState) => Array<Folder>;

export type CMSResourceCountSelector = (state: AppState) => number;

export type CMSResourceByIDSelector<Item extends CMSResource> = (
  state: AppState,
  params: { id: string | null }
) => Item | null;

export type CMSResourceByIDsSelector<Item extends CMSResource> = (
  state: AppState,
  params: { folderIDs: string[] }
) => Item[];

export type CMSResourcesByFolderIDSelector<Item extends CMSResource> = (
  state: AppState,
  params: { folderID: string | null }
) => Array<Item>;

export interface CMSResourceSearchContext {
  search: string;
  originalSearch: string;
}

export type CMSResourceSearch<
  Item extends CMSResource,
  SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext,
> = (item: Item | CMSFolder, context: SearchContext) => boolean;

export interface CMSManagerConfig<
  Item extends CMSResource,
  SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext,
> {
  /**
   * search function
   */
  search: CMSResourceSearch<Item, SearchContext>;

  /**
   * folder id from the url
   */
  folderID: string | null;

  /**
   * cms resource path to be used in the root resource navigation
   */
  pathname: string;

  /**
   * active version id
   */
  versionID: string;

  /**
   * folder scope, used in the folders selector inside the molecule
   */
  folderScope: FolderScope;

  /**
   * extra context to be passed to the search function
   */
  searchContext: Atom<Omit<SearchContext, keyof CMSResourceSearchContext>>;

  /**
   * resource redux effects
   */
  effects: {
    patchOne: (resourceID: string, resource: Partial<Item>) => Thunk;
    patchMany: (resourceIDs: string[], resource: Partial<Item>) => Thunk;

    deleteOne: (resourceID: string) => Thunk;
    deleteMany: (resourceID: string[]) => Thunk;

    exportMany?: (resourceID: string[]) => Thunk;
  };

  /**
   * cms resource selectors
   */
  selectors: {
    oneByID: CMSResourceByIDSelector<Item>;
    allByFolderID: CMSResourcesByFolderIDSelector<Item>;
    allByFolderIDs: CMSResourceByIDsSelector<Item>;
  };
}

export interface CMSManagerStaticConfig<
  Item extends CMSResource,
  SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext,
> extends Omit<CMSManagerConfig<Item, SearchContext>, 'folderID' | 'versionID' | 'folderScope' | 'pathname'> {}

export interface ICMSManagerProvider<
  Item extends CMSResource,
  SearchContext extends CMSResourceSearchContext = CMSResourceSearchContext,
> extends React.PropsWithChildren {
  staticConfig: CMSManagerStaticConfig<Item, SearchContext>;
}

export interface CMSManager<Item extends CMSResource> {
  /**
   * cms resource path to be used in the root resource navigation
   */
  url: Atom<string>;

  /**
   * cms resource items selected the redux
   */
  items: Atom<Atom<Item>[]>;

  /**
   * lowercased and rimmed search field value
   */
  search: Atom<string>;

  /**
   * cms folder items selected the redux
   */
  folders: Atom<Atom<CMSFolder>[]>;

  /**
   * true if there's no items and folders selected from redux
   */
  isEmpty: Atom<boolean>;

  /**
   * a boolean atom to indicate if the search field is empty
   */
  isSearch: Atom<boolean>;

  /**
   * opened folder id from the url
   */
  folderID: Atom<string | null>;

  /**
   * cms resource path to be used in the root resource navigation
   */
  pathname: Atom<string>;

  /**
   * cms resource items count
   */
  itemsSize: Atom<number>;

  /**
   * active version id
   */
  versionID: Atom<string>;

  /**
   * cms resource folders count
   */
  folderScope: Atom<FolderScope>;

  /**
   * cms resource items selected the redux
   */
  foldersSize: Atom<number>;

  /**
   * cms resource items and folders that should be rendered, search and other operation runs on it
   */
  dataToRender: Atom<Atom<Item | CMSFolder>[]>;

  /**
   * true if there's no items and folders to render due to search value
   */
  isSearchEmpty: Atom<boolean>;

  /**
   * original search value, usually used in the search input
   */
  originalSearch: PrimitiveAtom<string>;

  /**
   * cms resource items and folders that should be rendered size
   */
  dataToRenderSize: Atom<number>;

  /**
   * resource redux effects
   */
  effects: Atom<{
    patchOne: (resourceID: string, resource: Partial<Item>) => Thunk;
    patchMany: (resourceIDs: string[], resource: Partial<Item>) => Thunk;

    deleteOne: (resourceID: string) => Thunk;
    deleteMany: (resourceID: string[]) => Thunk;

    exportMany?: (resourceID: string[]) => Thunk;
  }>;

  /**
   * resource selectors
   */
  selectors: Atom<{
    oneByID: CMSResourceByIDSelector<Item>;
    allByFolderID: CMSResourcesByFolderIDSelector<Item>;
    allByFolderIDs: CMSResourceByIDsSelector<Item>;
  }>;

  /**
   * resource actions
   */
  actionStates: Atom<{
    moveToIsOpen: PrimitiveAtom<boolean>;
  }>;
}

import React from 'react';

import * as ReportTags from '@/ducks/reportTag';
import { createTag } from '@/ducks/reportTag';
import { addTag, currentTranscriptIDSelector } from '@/ducks/transcript';
import { connect } from '@/hocs';
import { useDispatch, useSelector } from '@/hooks';
import { ReportTag } from '@/models';
import { ConnectedProps } from '@/types';

export interface ReportTagInputContextApi {
  state: {
    allTags: ReportTag[];
    filteredTags: ReportTag[];
    searchedTag: string;
    tagsMap: {
      [key: string]: ReportTag;
    };
  };
  actions: {
    onSearch: (tagLabel: string) => void;
    updateFilteredTags: (tagID: string) => void;
    onCreateNew: (val: string) => void;
  };
}

export const ReportTagInputContext = React.createContext<ReportTagInputContextApi | null>(null);
export const { Consumer: ReportTagInputContextConsumer } = ReportTagInputContext;

export const UnconnectedReportTagInputContextProvider: React.FC<{ selectedTags: string[] } & ConnectedReportTagInputContextProps> = ({
  selectedTags,
  allTags,
  tagsMap,
  children,
}) => {
  const [filteredTags, setFilteredTags] = React.useState<ReportTag[]>(allTags.filter((tag) => !selectedTags.includes(tag.id)));
  const [searchedTag, setSearchedTag] = React.useState('');
  const createReportTag = useDispatch(createTag);
  const addReportTag = useDispatch(addTag);
  const currentTranscriptID = useSelector(currentTranscriptIDSelector);

  React.useEffect(() => {
    if (searchedTag.trim()) {
      setFilteredTags(filteredTags.filter((tag) => tag.label.includes(searchedTag)));
    }
  }, [searchedTag]);

  const onCreateNew = async (label: string) => {
    if (!currentTranscriptID) return;

    const id = await createReportTag(label);

    if (id) {
      addReportTag(currentTranscriptID, id);
      setSearchedTag('');
    }
  };

  React.useEffect(() => {
    setFilteredTags(allTags.filter((tag) => !selectedTags.includes(tag.id)));
  }, [selectedTags]);

  const api = {
    state: {
      filteredTags,
      searchedTag,
      allTags,
      tagsMap,
    },
    actions: {
      onSearch: (tagLabel: string) => setSearchedTag(tagLabel),
      updateFilteredTags: (tagID: string) => setFilteredTags(filteredTags.filter((tag) => tag.id !== tagID)),
      onCreateNew,
    },
  };

  return <ReportTagInputContext.Provider value={api}>{children}</ReportTagInputContext.Provider>;
};

const mapStateToProps = {
  allTags: ReportTags.allReportTagsSelector,
  tagsMap: ReportTags.mapReportTagsSelector,
};

const mapDispatchToProps = {
  addGlobalTag: ReportTags.addReportTag,
};

type ConnectedReportTagInputContextProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export const ReportTagInputProvider = connect(mapStateToProps, mapDispatchToProps)(UnconnectedReportTagInputContextProvider) as React.FC<{
  selectedTags: string[];
}>;

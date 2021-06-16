import React from 'react';

import * as ReportTags from '@/ducks/reportTag';
import { connect } from '@/hocs';
import { ReportTag } from '@/models';
import { ConnectedProps } from '@/types';

// TODO: remove
const SAMPLE_TAGS: ReportTag[] = [
  { id: '1', label: 'happy path', projectID: '1' },
  { id: '2', label: 'difficult path', projectID: '2' },
  { id: '3', label: 'sad path', projectID: '3' },
  { id: '4', label: "din't comply", projectID: '4' },
  { id: '5', label: 'repair path', projectID: '5' },
  { id: '6', label: 'successful error handling', projectID: '6' },
];
export interface ReportTagInputContextApi {
  state: {
    allTags: ReportTag[];
    filteredTags: ReportTag[];
    searchedTag: string;
  };
  actions: {
    onSearch: (tagLabel: string) => void;
    updateFilteredTags: (tagID: string) => void;
  };
}

export const ReportTagInputContext = React.createContext<ReportTagInputContextApi | null>(null);
export const { Consumer: ReportTagInputContextConsumer } = ReportTagInputContext;

// TODO: replace all SAMPLE_TAGS instances with 'tags' from props

export const UnconnectedReportTagInputContextProvider: React.FC<{ selectedTags: string[] } & ConnectedReportTagInputContextProps> = ({
  selectedTags,
  children,
}) => {
  const [filteredTags, setFilteredTags] = React.useState<ReportTag[]>(SAMPLE_TAGS.filter((tag) => !selectedTags.includes(tag.id)));
  const [searchedTag, setSearchedTag] = React.useState('');

  React.useEffect(() => {
    if (searchedTag.trim()) {
      setFilteredTags(filteredTags.filter((tag) => tag.label.includes(searchedTag)));
    }
  }, [searchedTag]);

  React.useEffect(() => {
    setFilteredTags(SAMPLE_TAGS.filter((tag) => !selectedTags.includes(tag.id)));
  }, [selectedTags]);

  const api = {
    state: {
      filteredTags,
      searchedTag,
      allTags: SAMPLE_TAGS,
    },
    actions: {
      onSearch: (tagLabel: string) => setSearchedTag(tagLabel),
      updateFilteredTags: (tagID: string) => setFilteredTags(filteredTags.filter((tag) => tag.id !== tagID)),
    },
  };

  return <ReportTagInputContext.Provider value={api}>{children}</ReportTagInputContext.Provider>;
};

const mapStateToProps = {
  tags: ReportTags.allReportTagsSelector,
};

const mapDispatchToProps = {
  addGlobalTag: ReportTags.addReportTag,
};

type ConnectedReportTagInputContextProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export const ReportTagInputProvider = connect(mapStateToProps, mapDispatchToProps)(UnconnectedReportTagInputContextProvider) as React.FC<{
  selectedTags: string[];
}>;

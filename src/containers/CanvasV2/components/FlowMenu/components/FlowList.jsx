import React from 'react';
import { Input } from 'reactstrap';

import { ROOT_DIAGRAM_NAME } from '@/constants';
import { allDiagramsSelector } from '@/ducks/diagram';
import { connect, styled } from '@/hocs';

import FlowButton from './FlowButton';
import SectionTitle from './SectionTitle';

export const SearchSection = styled.div`
  padding-left: 15px;
  padding-right: 15px;
`;

const FlowList = ({ diagrams }) => {
  const [filter, setFilter] = React.useState('');
  const trimmedFilter = filter.trim();
  const updateFilter = ({ target }) => setFilter(target.value);

  return (
    <>
      <SectionTitle className="mt-1">All Flows</SectionTitle>
      <SearchSection>
        <Input placeholder="Search Flows" name="filter" value={filter} onChange={updateFilter} className="mb-2 search-input" />
      </SearchSection>

      <div className="flows-list">
        {diagrams.map((diagram) => {
          const name = diagram.name === ROOT_DIAGRAM_NAME ? 'Home' : diagram.name;

          if (trimmedFilter && !name.toLowerCase().includes(filter.toLowerCase())) {
            return null;
          }

          return <FlowButton diagram={diagram} key={diagram.id} />;
        })}
      </div>
    </>
  );
};

const mapStateToProps = {
  diagrams: allDiagramsSelector,
};

export default connect(mapStateToProps)(FlowList);

import React from 'react';
import { useLocation } from 'react-router-dom';
import { AutoSizer, List } from 'react-virtualized';

import { ProjectRoute } from '@/config/routes';

import { Container, TranscriptResultsItem } from './components';

const DUMMY_DATA = [
  {
    id: '1',
    name: 'Josh Ho',
    date: '9:39 am, May 1st',
    tags: ['repair path', 'happy path'],
    read: true,
    reviewed: true,
    saved: true,
  },
  {
    id: '2',
    name: 'Mike Hood',
    date: '1:79 am, May 2st',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: true,
    saved: true,
  },
  {
    id: '3',
    name: 'Barack Obama',
    date: '1:79 am, May 2st',
    tags: ['repair path', 'happy path'],
    read: true,
    reviewed: false,
    saved: true,
  },
  {
    id: '4',
    name: 'Donald Trump',
    date: '1:79 am, May 2st',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: true,
    saved: false,
  },
  {
    id: '5',
    name: 'Tyler Han',
    date: '1:79 am, May 2st',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: false,
    saved: false,
  },
  {
    id: '6',
    name: 'Andrew Lawrence',
    date: '1:79 am, May 2st',
    tags: ['repair path', 'happy path'],
    read: false,
    reviewed: false,
    saved: true,
  },
  {
    id: '7',
    name: 'Braden Ream',
    date: '1:79 am, May 2nd',
    tags: ['repair path', 'happy path'],
    read: true,
    reviewed: true,
    saved: true,
  },
];

const TranscriptResultsList = () => {
  const { pathname } = useLocation();
  const activeTranscriptID = pathname.split(`${ProjectRoute.CONVERSATIONS}`)[1]?.replace('/', '').split('?')[0] || null;

  return (
    <Container>
      <AutoSizer disableHeight={true}>
        {({ width }) => {
          return (
            <List
              width={width}
              rowCount={DUMMY_DATA.length}
              rowHeight={88}
              autoHeight
              rowRenderer={({ key, index }) => {
                const data = DUMMY_DATA[index];
                return <TranscriptResultsItem key={key} data={DUMMY_DATA[index]} active={activeTranscriptID === data.id} />;
              }}
              height={20}
            />
          );
        }}
      </AutoSizer>
    </Container>
  );
};

export default TranscriptResultsList;

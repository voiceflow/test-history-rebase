import * as Realtime from '@voiceflow/realtime-sdk';
import ObjectID from 'bson-objectid';
import dayjs from 'dayjs';

import * as ProjectV2 from '@/ducks/projectV2';

import { SortByTypes } from './constants';

export const getProjectSortFunction = (
  activeViewersPerProject: { [k: string]: ProjectV2.DiagramViewer[] },
  sortByType: SortByTypes
): ((a: Realtime.AnyProject, b: Realtime.AnyProject) => number) => {
  if (sortByType === SortByTypes.Alphabetically) {
    return (a: Realtime.AnyProject, b: Realtime.AnyProject) => {
      if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
      if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
      return 0;
    };
  }
  if (sortByType === SortByTypes.DateCreated) {
    return (a: Realtime.AnyProject, b: Realtime.AnyProject) => {
      const a_date = new ObjectID(a.id).getTimestamp().toString();
      const b_date = new ObjectID(b.id).getTimestamp().toString();

      return dayjs(a_date).isAfter(b_date) ? -1 : 1;
    };
  }

  return (a: Realtime.AnyProject, b: Realtime.AnyProject) => {
    const aViewers = activeViewersPerProject[a.id] ?? [];
    const bViewers = activeViewersPerProject[b.id] ?? [];

    if (aViewers.length && !bViewers.length) return -1;
    if (bViewers.length && !aViewers.length) return 1;
    if (a.updatedAt && !b.updatedAt) return -1;
    if (b.updatedAt && !a.updatedAt) return 1;
    return dayjs(a.updatedAt).isAfter(b.updatedAt) ? -1 : 1;
  };
};

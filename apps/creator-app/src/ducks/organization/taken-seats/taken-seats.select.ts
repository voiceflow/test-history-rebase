import { createSelector } from 'reselect';

import { organizationSelector } from '../member/member.select';

export const takenSeatsSelector = createSelector([organizationSelector], (organization) => organization?.takenSeats);

import get from 'lodash/get';

export const isUserPro = (user) => get(user, ['subscription', 'plan']) === 'pro';

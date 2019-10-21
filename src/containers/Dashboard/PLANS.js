export const PLAN_NAME = ['Hobbyist', 'Professional', 'Business'];

const PLANS = {
  HOBBY: {
    id: 0,
    name: 'Hobbyist',
    rate: 0,
    image: '/images/icons/hobbyist.svg',
    features: ['3 projects', 'Community support'],
  },
  PROFESSIONAL: {
    id: 1,
    name: 'Professional',
    rate: 29,
    image: '/images/icons/collaborate-selected.svg',
    features: ['Unlimited projects', '3 collaborators', 'Intercom support'],
  },
  BUSINESS: {
    id: 2,
    name: 'Business',
    rate: 99,
    image: '/images/icons/briefcase.svg',
    features: ['Priority support', 'All Professional features', 'Unlimited collaborators', 'Account linking'],
  },
};

const temp = {};
Object.keys(PLANS).forEach((key) => {
  temp[PLANS[key].id] = {
    ...PLANS[key],
    tag: key,
  };
});

export default PLANS;
export const PLANS_ID = temp;

const PLANS = {
  "HOBBY": {
    id: 0,
    name: "Hobbyist",
    rate: 0,
    image: "/images/icons/collaborate-selected.svg",
    features: [
      "Community Support",
      "3 projects",
      "2 collaborators"
    ]
  },
  "PROFESSIONAL": {
    id: 1,
    name: "Professional",
    rate: 29,
    image: "/images/icons/collaborate-selected.svg",
    features: [
      "Intercom support",
      "Unlimited projects",
      "Up to 3 collaborators"
    ]
  },
  "BUSINESS": {
    id: 2,
    name: "Business",
    rate: 99,
    image: '/images/icons/briefcase.svg',
    features: [
      "Priority Support",
      "All Professional features",
      "Unlimited collaborators",
      "Account linking"
    ]
  }
}

const temp = {}
for(var p in PLANS) {
  temp[PLANS[p].id] = {
    ...PLANS[p],
    tag: p
  }
}

export default PLANS
export const PLANS_ID = temp
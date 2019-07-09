export function getUserPlanName(plan) {
  switch (plan) {
    case 0:
      return 'COMMUNITY';
    case 1:
      return 'BASIC';
    case 10:
      return 'ADMIN';
    default:
      return 'UNKNOWN';
  }
}

export const PERMISSIONS = [
  { label: 'Reminders', value: 'alexa::alerts:reminders:skill:readwrite' },
  { label: 'Notifications', value: 'alexa::devices:all:notifications:write' },
  { label: 'Address', value: 'alexa::devices:all:address:full:read' },
  { label: 'Full Name', value: 'alexa::profile:name:read' },
  { label: 'Email', value: 'alexa::profile:email:read' },
  { label: 'Phone', value: 'alexa::profile:mobile_number:read' },
  { label: 'Location Services', value: 'alexa::devices:all:geolocation:read' },
  { label: 'Skill Personalization', value: 'alexa::person_id:read' },
];

export const PERMISSION_LABELS = PERMISSIONS.reduce<Record<string, string>>((acc, { label, value }) => {
  acc[value] = label;

  return acc;
}, {});

export const isDefaultIntentName = (name?: string | null) => !name || name.toLowerCase().startsWith('intent');

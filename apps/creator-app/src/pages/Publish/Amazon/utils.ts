export const DEFAULT_TERM_ENDPOINT = 'https://creator.voiceflow.com/creator';

export const generateTerms = (name: string, skill: string, children?: boolean): string =>
  `${DEFAULT_TERM_ENDPOINT}/terms?name=${encodeURI(name)}&skill=${encodeURI(skill)}${typeof children === 'boolean' ? `&children=${children}` : ''}`;

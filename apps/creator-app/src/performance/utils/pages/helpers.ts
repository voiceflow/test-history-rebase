export function $<T extends HTMLElement = HTMLElement>(selector: string): T;
export function $<T extends HTMLElement = HTMLElement>(parent: HTMLElement, selector: string): T;
export function $<T extends HTMLElement = HTMLElement>(parentOrSelector: string | HTMLElement, selector?: string): T {
  if (typeof parentOrSelector === 'string') {
    return document.querySelector<T>(parentOrSelector)!;
  }

  return parentOrSelector.querySelector<T>(selector!)!;
}

export function $$<T extends HTMLElement = HTMLElement>(selector: string): T[];
export function $$<T extends HTMLElement = HTMLElement>(parent: HTMLElement, selector: string): T[];
export function $$<T extends HTMLElement = HTMLElement>(parentOrSelector: string | HTMLElement, selector?: string): T[] {
  if (typeof parentOrSelector === 'string') {
    return Array.from(document.querySelectorAll<T>(parentOrSelector));
  }

  return Array.from(parentOrSelector.querySelectorAll<T>(selector!));
}

export const id = (name: string): string => `#${name}`;
export const cls = (...names: string[]): string => `.${names.join('--')}`;
export const dataAttr = (name: string, value: string | boolean | number): string => `[data-${name}="${value}"]`;

export const selector = (base: string) => {
  let baseSelector = base;

  const builder = {
    and: (...classes: string[]) => {
      baseSelector += classes.join('');

      return builder;
    },

    next: (...classes: string[]) => {
      baseSelector += `+${classes.join('')}`;

      return builder;
    },

    child: (...classes: string[]) => {
      baseSelector += ` ${classes.join('')}`;

      return builder;
    },

    toString: () => baseSelector,
  } as const;

  return builder;
};

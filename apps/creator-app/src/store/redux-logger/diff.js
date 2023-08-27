import differ from 'deep-diff';

export function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
    case 'E':
      return [path.join('.'), lhs, '→', rhs];
    case 'N':
      return [path.join('.'), rhs];
    case 'D':
      return [path.join('.')];
    case 'A':
      return [`${path.join('.')}[${index}]`, item];
    default:
      return [];
  }
}

export default function diffLogger(prevState, newState) {
  const diff = differ(prevState, newState);
  const ret = [];
  if (diff) {
    diff.forEach((elem) => {
      const { kind } = elem;
      const output = render(elem);
      ret.push({
        kind,
        output,
      });
    });
  }

  return ret;
}

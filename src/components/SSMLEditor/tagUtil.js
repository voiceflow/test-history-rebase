export function makeStartTag(data) {
  const { VF_tag, VF_void, ...props } = data;
  const propString = Object.entries(props)
    .filter((v) => !v[0].startsWith('VF_'))
    .map(([k, v]) => `${k}=${JSON.stringify(v)}`)
    .join(' ');
  return `<${VF_tag} ${propString} ${VF_void ? '/' : ''}>`;
}

export function makeEndTag(data) {
  const { VF_tag } = data;
  return `</${VF_tag}>`;
}

export function makeETag(data) {
  const { VF_path, VF_custom } = data;
  const end = VF_path[VF_custom ? 0 : VF_path.length - 1];
  return end
    .toUpperCase()
    .replace(/MONTH/g, 'M')
    .replace(/DAY/g, 'D')
    .replace(/YEAR/g, 'Y');
}

export function makeDescription(data) {
  const { VF_path } = data;
  if (VF_path.length === 1) return VF_path[0];
  return `${VF_path[VF_path.length - 2]}: ${VF_path[VF_path.length - 1]}`;
}

export function wrapVoice(voice, ssml) {
  if (voice === 'Alexa') return ssml;
  return `<voice name=${JSON.stringify(voice)}>${ssml}</voice>`;
}

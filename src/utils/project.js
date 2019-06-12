export const projectStatusIsDevelopment = (project = {}) => statusIsDevelopment(project.publishing_skill_status);

export const projectStatusIsCertification = (project = {}) => statusIsCertification(project.publishing_skill_status);

export function statusIsDevelopment(status) {
  return status === 'development';
}
export function statusIsCertification(status) {
  return status === 'certification';
}

export const versionsIncludesDev = (versions = []) => versions.includes('dev');
export const versionsIncludesCert = (versions = []) => versions.includes('cert');
export const versionsIncludesLive = (versions = []) => versions.includes('live');

export const getVariableByName = (name, variables) => variables.find((v) => name === v.name);

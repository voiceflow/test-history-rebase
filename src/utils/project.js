export const projectStatusIsDevelopment = (project = {}) =>
  statusIsDevelopment(project.publishing_skill_status);

export const projectStatusIsCertification = (project = {}) =>
  statusIsCertification(project.publishing_skill_status);

export const statusIsDevelopment = status => status === 'development';
export const statusIsCertification = status => status === 'certification';

export const versionsIncludesDev = (versions = []) => versions.includes('dev');
export const versionsIncludesCert = (versions = []) => versions.includes('cert');
export const versionsIncludesLive = (versions = []) => versions.includes('live');

export const getVariableByName = (name, variables) => variables.find(v => name === v.name);

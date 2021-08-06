export interface Template {
  id: string;
  moduleProjectID: number;
  projectID: string;
  creatorID: number;
  title: string;
  description: string;
  icon: string;
  color: string;
}

export interface DBTemplate {
  module_id: string;
  module_project_id: number;
  project_id: string;
  creator_id: number;
  title: string;
  descr: string;
  module_icon: string;
  color: string;
}

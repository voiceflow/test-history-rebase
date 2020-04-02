/* eslint-disable camelcase */
export type UserType = {
  created_at?: string;
  creator_id?: number | string;
  project_id?: string | null;
  platform?: string;
  user_id?: string;
  user_data?: { name?: string; email?: string };
  integration_user_id?: string;
  requires_refresh?: null;
};

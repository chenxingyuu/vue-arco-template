export type RoleType = '' | '*' | 'admin' | 'user';

export interface UserState {
  name?: string;
  avatar?: string;
  job?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  certification?: number;
  role: RoleType;
  permissions: string[];
}

export interface Permission {
  id: number;
  name: string;
  description: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
  creator_id: number;
}

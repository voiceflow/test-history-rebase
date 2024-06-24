'use server';

import { hashidsClient } from '@/clients/hashids.client';

export const decodeWorkspaceID = (workspaceID: string): number | null => hashidsClient.decode(workspaceID)[0] ?? null;

export const encodeWorkspaceID = (workspaceID: number): string => hashidsClient.encode(workspaceID);

/**
 * Standardized API Envelopes
 * Matches NestJS backend specifications for BaseRequest and Response.
 */

export enum Platform {
  ANDROID = "android",
  IOS = "ios",
  WEB = "web",
}

export interface RequestHeader {
  platform: Platform;
  userID?: string;
  requestID?: string;
  version?: string;
  tz?: string;
}

export interface BaseRequest<T> {
  header: RequestHeader;
  body: T;
}

export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  error: any | null;
  data: T;
  meta: {
    timestamp: string;
    requestID?: string;
  };
}

/**
 * Workspace & Board Types
 */

export enum BoardVisibility {
  WORKSPACE = "workspace",
  PRIVATE = "private",
  PUBLIC = "public",
}

export enum BoardStatus {
  ACTIVE = "active",
  UPDATING = "updating",
  ARCHIVED = "archived",
}

export interface Workspace {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  logo_url?: string;
  boards?: Board[];
  created_at?: string;
}

export interface Board {
  id: string;
  name: string;
  workspace_id: string;
  visibility: BoardVisibility;
  background?: string;
  is_image: boolean;
  status: BoardStatus;
  created_at?: string;
}

export interface CreateWorkspaceRequest {
  name: string;
  description?: string;
  slug?: string;
  logo_url?: string;
  userID: string;
}

export interface UpdateWorkspaceRequest extends Partial<CreateWorkspaceRequest> {
  id: string;
}

export interface CreateBoardDto {
  name: string;
  workspace_id: string;
  visibility?: BoardVisibility;
  background?: string;
  is_image?: boolean;
}

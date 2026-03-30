/**
 * Standardized API Envelopes
 * Matches NestJS backend specifications for BaseRequest and Response.
 */

export enum Platform {
  ANDROID = 'android',
  IOS = 'ios',
  WEB = 'web',
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
  status: 'success' | 'error';
  message: string;
  error: any | null;
  data: T;
  meta: {
    timestamp: string;
    requestID?: string;
  };
}

export type FetchOptions = {
  timeoutMs?: number;
};

export type HealthResponse = Record<string, any>;

export type RequestOtpResponse = {
  success?: boolean;
  phone?: string;
  expireMs?: number;
  cooldownMs?: number;
  delivery?: any;
  debugOtp?: string;
} & Record<string, any>;

export type VerifyOtpResponse = {
  success?: boolean;
  error?: string;
  remaining?: number;
} & Record<string, any>;

export function setBaseUrl(url: string): void;
export function getBaseUrl(): Promise<string>;
export function attachStorage(s: {
  getItem?: (key: string) => string | undefined | Promise<string | undefined>;
  setItem?: (key: string, value: string) => void | Promise<void>;
}): void;
export function health(opts?: FetchOptions): Promise<HealthResponse>;
export function requestOtp(phone: string, opts?: FetchOptions): Promise<RequestOtpResponse>;
export function verifyOtp(phone: string, otp: string, opts?: FetchOptions): Promise<VerifyOtpResponse>;

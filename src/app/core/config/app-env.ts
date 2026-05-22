type RuntimeEnv = {
  BACK_URL?: string;
};

const globalEnv = (globalThis as { __env?: RuntimeEnv }).__env;
const metaEnv = (import.meta as { env?: RuntimeEnv }).env;
const rawBackUrl =
  globalEnv?.BACK_URL ||
  metaEnv?.BACK_URL ||
  (globalThis as { process?: { env?: RuntimeEnv } }).process?.env?.BACK_URL ||
  'http://localhost:3000';

const normalizeBaseUrl = (value: string) => value.replace(/\/+$/, '');

export const BACK_URL = normalizeBaseUrl(rawBackUrl);
export const API_URL = `${BACK_URL}/api`;

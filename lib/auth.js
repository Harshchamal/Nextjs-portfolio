import crypto from 'crypto';
import { cookies } from 'next/headers';

export const SESSION_COOKIE_NAME = 'dashboard_session';
const SESSION_MAX_AGE_SECONDS = 7 * 24 * 60 * 60; // 7 days

function getSecret() {
  return process.env.DASHBOARD_SESSION_SECRET || process.env.DASHBOARD_PASSWORD || '';
}

function sign(expiry) {
  return crypto.createHmac('sha256', getSecret()).update(String(expiry)).digest('hex');
}

export function createSessionCookieValue() {
  const expiry = Date.now() + SESSION_MAX_AGE_SECONDS * 1000;
  return `${expiry}.${sign(expiry)}`;
}

export function verifySessionCookieValue(value) {
  if (!value || typeof value !== 'string') return false;
  const [expiryStr, signature] = value.split('.');
  const expiry = Number(expiryStr);
  if (!expiry || !signature || Date.now() > expiry) return false;

  const expected = sign(expiry);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

export function isAuthed() {
  const store = cookies();
  return verifySessionCookieValue(store.get(SESSION_COOKIE_NAME)?.value);
}

export function checkPassword(password) {
  return typeof password === 'string' && password === process.env.DASHBOARD_PASSWORD;
}

export const sessionCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: SESSION_MAX_AGE_SECONDS,
};

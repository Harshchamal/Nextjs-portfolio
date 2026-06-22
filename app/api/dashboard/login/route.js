import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { checkPassword, createSessionCookieValue, SESSION_COOKIE_NAME, sessionCookieOptions } from '@/lib/auth';

export async function POST(request) {
  const { password } = await request.json();

  if (!process.env.DASHBOARD_PASSWORD) {
    return NextResponse.json(
      { error: 'Server is missing DASHBOARD_PASSWORD env variable' },
      { status: 500 }
    );
  }

  if (!checkPassword(password)) {
    return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
  }

  cookies().set(SESSION_COOKIE_NAME, createSessionCookieValue(), sessionCookieOptions);
  return NextResponse.json({ success: true });
}

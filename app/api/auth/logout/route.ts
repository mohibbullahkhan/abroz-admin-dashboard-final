import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Await the cookies() promise to get the ReadonlyRequestCookies object
  const cookieStore = await cookies();
  
  // Delete the token cookie
  cookieStore.delete('token');
  
  // Also delete the old auth cookie just in case it's lingering
  cookieStore.delete('auth');

  return NextResponse.json({ success: true });
}

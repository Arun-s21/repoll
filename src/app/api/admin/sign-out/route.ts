import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = NextResponse.json({
      message: 'Logout successful',
      success: true,
    });

    
    response.cookies.set('token', '', {         //setting the token to an empty string
      httpOnly: true,
      path: '/',
      expires: new Date(0), 
    });

    return response;

  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({ error: 'Failed to sign out' }, { status: 500 });
  }
}
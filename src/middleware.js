'use server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function middleware(req) {
  const url = req.url
  const cookieStore = cookies() // Using the new API for getting cookies in Next.js 12+

  const authToken = cookieStore.get('token') // Get the authToken from the cookies

  // Allow static assets and login-related paths to pass through without any checks
  if (
    url.includes('/_next/') ||
    url.includes('/static/') ||
    url.includes('/images/') ||
    url.includes('/favicon.ico') ||
    url.includes('/login') // Exclude login page and others
  ) {
    return NextResponse.next()
  }

  console.log('GGG', 'Checking for authToken', authToken)

  // If authToken exists, continue with the request
  if (authToken) {
    return NextResponse.next()
  } else {
    console.error('Error verifying token: No authToken found')
    return NextResponse.redirect(new URL('/login', req.url))
    // return NextResponse.next()
  }
}

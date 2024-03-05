'use client';

import { signOut } from 'next-auth/react'

export default function LogoutBtn() {
  return <button className='text-xs'  onClick={() => { signOut() }}>LOGOUT</button>
} 
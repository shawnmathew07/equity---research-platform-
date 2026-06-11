'use client'

import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/watchlist`
      }
    })
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif'}}>
      <h1 style={{fontSize:'2rem',fontWeight:'bold',marginBottom:'0.5rem'}}>📈 Equity Research Platform</h1>
      <p style={{color:'#6b7280',marginBottom:'2rem'}}>Sign in to save your watchlist</p>
      <button
        onClick={handleGoogleLogin}
        style={{padding:'0.75rem 2rem',backgroundColor:'white',color:'black',border:'none',borderRadius:'8px',fontWeight:'600',fontSize:'1rem',cursor:'pointer',display:'flex',alignItems:'center',gap:'0.5rem'}}
      >
        🔵 Sign in with Google
      </button>
    </div>
  )
}
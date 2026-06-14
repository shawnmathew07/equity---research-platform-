'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    getUser()
  }, [])

  return (
    <nav style={{backgroundColor:'#111827',padding:'1rem 2rem',display:'flex',justifyContent:'space-between',alignItems:'center',fontFamily:'sans-serif',borderBottom:'1px solid #1f2937'}}>
      <span
        onClick={() => router.push('/')}
        style={{fontWeight:'700',fontSize:'1.1rem',cursor:'pointer',color:'white'}}
      >
        📈 Equity Research
      </span>
      <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
        <span
          onClick={() => router.push('/')}
          style={{color:'#9ca3af',cursor:'pointer',fontSize:'0.9rem'}}
        >
          Search
        </span>
        
        <span
          onClick={() => router.push('/screener')}
          style={{color:'#9ca3af',cursor:'pointer',fontSize:'0.9rem'}}
        >
          Screener
        </span>
        <span
          onClick={() => router.push('/dcf')}
          style={{color:'#9ca3af',cursor:'pointer',fontSize:'0.9rem'}}
        >
          DCF
        </span>
        <span
          onClick={() => router.push('/watchlist')}
          style={{color:'#9ca3af',cursor:'pointer',fontSize:'0.9rem'}}
        >
          Watchlist
        </span>
      
        {user ? (
          <button
            onClick={async () => { await supabase.auth.signOut(); setUser(null); router.push('/') }}
            style={{padding:'0.4rem 1rem',backgroundColor:'#7f1d1d',color:'#fca5a5',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600',fontSize:'0.85rem'}}
          >
            Sign Out
          </button>
        ) : (
          <button
            onClick={() => router.push('/login')}
            style={{padding:'0.4rem 1rem',backgroundColor:'#2563eb',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600',fontSize:'0.85rem'}}
          >
            Sign In
          </button>
        )}
      </div>
    </nav>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Home() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)
    }
    getUser()
  }, [])

  const searchStocks = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    if (value.length < 1) { setResults([]); return }
    const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
    const res = await fetch(`https://finnhub.io/api/v1/search?q=${value}&token=${apiKey}`)
    const data = await res.json()
    setResults(data.result?.slice(0, 6) || [])
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',padding:'2rem'}}>

      {/* Top right buttons */}
      <div style={{position:'absolute',top:'1.5rem',right:'1.5rem',display:'flex',gap:'0.75rem'}}>
        {user ? (
          <>
            <button
              onClick={() => router.push('/watchlist')}
              style={{padding:'0.5rem 1rem',backgroundColor:'#1f2937',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600'}}
            >
              📋 Watchlist
            </button>
            <button
              onClick={async () => { await supabase.auth.signOut(); setUser(null) }}
              style={{padding:'0.5rem 1rem',backgroundColor:'#7f1d1d',color:'#fca5a5',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600'}}
            >
              Sign Out
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push('/login')}
            style={{padding:'0.5rem 1rem',backgroundColor:'#2563eb',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600'}}
          >
            Sign In
          </button>
        )}
      </div>

      <h1 style={{fontSize:'2.5rem',fontWeight:'bold',marginBottom:'0.5rem'}}>📈 Equity Research Platform</h1>
      <p style={{color:'#6b7280',marginBottom:'2rem'}}>Search any stock to get started</p>

      <div style={{width:'100%',maxWidth:'500px',position:'relative'}}>
        <input
          type="text"
          value={query}
          onChange={searchStocks}
          placeholder="Search stocks... (e.g. AAPL, TSLA)"
          style={{width:'100%',padding:'0.875rem 1rem',backgroundColor:'#111827',color:'white',border:'1px solid #374151',borderRadius:'10px',fontSize:'1rem',outline:'none',boxSizing:'border-box'}}
        />
        {results.length > 0 && (
          <div style={{position:'absolute',top:'100%',left:0,right:0,backgroundColor:'#111827',border:'1px solid #374151',borderRadius:'10px',marginTop:'0.5rem',zIndex:10,overflow:'hidden'}}>
            {results.map((stock) => (
              <div
                key={stock.symbol}
                onClick={() => router.push(`/stock/${stock.symbol}`)}
                style={{padding:'0.75rem 1rem',cursor:'pointer',borderBottom:'1px solid #1f2937',display:'flex',justifyContent:'space-between',alignItems:'center'}}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1f2937')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <span style={{fontWeight:'600'}}>{stock.symbol}</span>
                <span style={{color:'#9ca3af',fontSize:'0.875rem'}}>{stock.description}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
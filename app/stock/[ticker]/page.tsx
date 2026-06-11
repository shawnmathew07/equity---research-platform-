'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function StockPage() {
  const { ticker } = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [watchlistMsg, setWatchlistMsg] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)

      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
      const [quoteRes, profileRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`)
      ])
      setQuote(await quoteRes.json())
      setProfile(await profileRes.json())
      setLoading(false)
    }
    fetchData()
  }, [ticker])

  const addToWatchlist = async () => {
    if (!user) { router.push('/login'); return }
    const { error } = await supabase.from('watchlist').insert([{
      user_id: user.id,
      ticker: ticker,
      company_name: profile?.name || ticker,
    }])
    setWatchlistMsg(error ? '❌ Error: ' + error.message : '✅ Added to watchlist!')
  }

  if (loading) return <div style={{color:'white',padding:'2rem'}}>Loading...</div>

  const priceChange = quote?.d ?? 0
  const priceChangePercent = quote?.dp ?? 0
  const isPositive = priceChange >= 0

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',padding:'2rem',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>

        <p onClick={() => router.push('/')} style={{color:'#6b7280',fontSize:'0.875rem',marginBottom:'0.5rem',cursor:'pointer'}}>← Back</p>

        <h1 style={{fontSize:'2rem',fontWeight:'bold',margin:'0 0 0.25rem 0'}}>{profile?.name || ticker}</h1>
        <p style={{color:'#6b7280',margin:'0 0 1.5rem 0'}}>{String(ticker)} · {profile?.exchange}</p>

        <div style={{marginBottom:'1.5rem'}}>
          <p style={{fontSize:'2.5rem',fontWeight:'bold',margin:'0'}}>${quote?.c?.toFixed(2)}</p>
          <p style={{fontSize:'1.1rem',margin:'0.25rem 0 0 0',color: isPositive ? '#4ade80' : '#f87171'}}>
            {isPositive ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePercent).toFixed(2)}%)
          </p>
        </div>

        <button
          onClick={addToWatchlist}
          style={{padding:'0.6rem 1.5rem',backgroundColor:'#2563eb',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer',fontSize:'1rem',marginBottom:'0.75rem'}}
        >
          + Add to Watchlist
        </button>
        {watchlistMsg && (
          <p style={{color: watchlistMsg.includes('❌') ? '#f87171' : '#4ade80',margin:'0 0 1.5rem 0'}}>
            {watchlistMsg}
          </p>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',backgroundColor:'#111827',borderRadius:'12px',padding:'1.5rem'}}>
          <div>
            <p style={{color:'#6b7280',fontSize:'0.8rem',margin:'0 0 0.25rem 0'}}>Industry</p>
            <p style={{margin:0,fontWeight:'500'}}>{profile?.finnhubIndustry || 'N/A'}</p>
          </div>
          <div>
            <p style={{color:'#6b7280',fontSize:'0.8rem',margin:'0 0 0.25rem 0'}}>Country</p>
            <p style={{margin:0,fontWeight:'500'}}>{profile?.country || 'N/A'}</p>
          </div>
          <div>
            <p style={{color:'#6b7280',fontSize:'0.8rem',margin:'0 0 0.25rem 0'}}>Market Cap</p>
            <p style={{margin:0,fontWeight:'500'}}>${((profile?.marketCapitalization || 0) * 1e6).toLocaleString()}</p>
          </div>
          <div>
            <p style={{color:'#6b7280',fontSize:'0.8rem',margin:'0 0 0.25rem 0'}}>Shares Outstanding</p>
            <p style={{margin:0,fontWeight:'500'}}>{(profile?.shareOutstanding || 0).toLocaleString()}M</p>
          </div>
        </div>

      </div>
    </div>
  )
}
'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function StockPage() {
  const { ticker } = useParams()
  const [quote, setQuote] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [watchlistMsg, setWatchlistMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
      const [quoteRes, profileRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`)
      ])
      const quoteData = await quoteRes.json()
      const profileData = await profileRes.json()
      setQuote(quoteData)
      setProfile(profileData)
      setLoading(false)
    }
    fetchData()
  }, [ticker])

  const addToWatchlist = async () => {
    const { error } = await supabase.from('watchlist').insert([
      {
        user_id: 'guest',
        ticker: ticker,
        company_name: profile?.name || ticker,
      }
    ])
    if (error) {
      setWatchlistMsg('❌ Error: ' + error.message)
    } else {
      setWatchlistMsg('✅ Added to watchlist!')
    }
  }

  if (loading) return (
    <div style={{color:'white',padding:'2rem'}}>Loading...</div>
  )

  const priceChange = quote?.d ?? 0
  const priceChangePercent = quote?.dp ?? 0
  const isPositive = priceChange >= 0

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',padding:'2rem',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>

        {/* Ticker Badge */}
        <p style={{color:'#6b7280',fontSize:'0.875rem',marginBottom:'0.5rem'}}>← Back</p>

        {/* Company Name */}
        <h1 style={{fontSize:'2rem',fontWeight:'bold',margin:'0 0 0.25rem 0'}}>
          {profile?.name || ticker}
        </h1>
        <p style={{color:'#6b7280',margin:'0 0 1.5rem 0'}}>
          {String(ticker)} · {profile?.exchange}
        </p>

        {/* Price Block */}
        <div style={{marginBottom:'1.5rem'}}>
          <p style={{fontSize:'2.5rem',fontWeight:'bold',margin:'0'}}>
            ${quote?.c?.toFixed(2)}
          </p>
          <p style={{fontSize:'1.1rem',margin:'0.25rem 0 0 0',color: isPositive ? '#4ade80' : '#f87171'}}>
            {isPositive ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePercent).toFixed(2)}%)
          </p>
        </div>

        {/* Watchlist Button */}
        <button
          onClick={addToWatchlist}
          style={{padding:'0.6rem 1.5rem',backgroundColor:'#2563eb',color:'white',border:'none',borderRadius:'8px',fontWeight:'600',cursor:'pointer',fontSize:'1rem',marginBottom:'0.75rem'}}
        >
          + Add to Watchlist
        </button>
        {watchlistMsg && (
          <p style={{color: watchlistMsg.includes('❌') ? '#f87171' : '#4ade80', margin:'0 0 1.5rem 0'}}>
            {watchlistMsg}
          </p>
        )}

        {/* Info Grid */}
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
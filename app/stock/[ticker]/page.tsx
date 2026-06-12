'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function StockPage() {
  const { ticker } = useParams()
  const router = useRouter()
  const [quote, setQuote] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [chartData, setChartData] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [watchlistMsg, setWatchlistMsg] = useState('')
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await supabase.auth.getSession()
      setUser(data.session?.user || null)

      const apiKey = process.env.NEXT_PUBLIC_FINNHUB_API_KEY
      const to = Math.floor(Date.now() / 1000)
      const from = to - 30 * 24 * 60 * 60

      const [quoteRes, profileRes, candleRes] = await Promise.all([
        fetch(`https://finnhub.io/api/v1/quote?symbol=${ticker}&token=${apiKey}`),
        fetch(`https://finnhub.io/api/v1/stock/profile2?symbol=${ticker}&token=${apiKey}`),
        fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${ticker}&resolution=D&from=${from}&to=${to}&token=${apiKey}`)
      ])

      const quoteData = await quoteRes.json()
      const profileData = await profileRes.json()
      const candleData = await candleRes.json()

      console.log('Candle data:', candleData)

      setQuote(quoteData)
      setProfile(profileData)

      if (candleData.s === 'ok' && candleData.t) {
        const formatted = candleData.t.map((timestamp: number, i: number) => ({
          date: new Date(timestamp * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: parseFloat(candleData.c[i].toFixed(2))
        }))
        setChartData(formatted)
      } else {
        // Generate dummy chart from current price for visual demo
        const basePrice = quoteData?.pc || 100
        const dummy = Array.from({ length: 30 }, (_, i) => ({
          date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: parseFloat((basePrice + (Math.random() - 0.5) * basePrice * 0.05).toFixed(2))
        }))
        setChartData(dummy)
      }

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
      <div style={{maxWidth:'800px',margin:'0 auto'}}>

        <p onClick={() => router.push('/')} style={{color:'#6b7280',fontSize:'0.875rem',marginBottom:'0.5rem',cursor:'pointer'}}>← Back</p>

        <h1 style={{fontSize:'2rem',fontWeight:'bold',margin:'0 0 0.25rem 0'}}>{profile?.name || ticker}</h1>
        <p style={{color:'#6b7280',margin:'0 0 1.5rem 0'}}>{String(ticker)} · {profile?.exchange}</p>

        <div style={{marginBottom:'1.5rem'}}>
          <p style={{fontSize:'2.5rem',fontWeight:'bold',margin:'0'}}>${quote?.c?.toFixed(2)}</p>
          <p style={{fontSize:'1.1rem',margin:'0.25rem 0 0 0',color: isPositive ? '#4ade80' : '#f87171'}}>
            {isPositive ? '▲' : '▼'} {Math.abs(priceChange).toFixed(2)} ({Math.abs(priceChangePercent).toFixed(2)}%)
          </p>
        </div>

        {/* Price Chart */}
        <div style={{backgroundColor:'#111827',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <p style={{color:'#9ca3af',fontSize:'0.85rem',margin:'0 0 1rem 0'}}>30-Day Price History</p>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData}>
              <XAxis dataKey="date" tick={{fill:'#6b7280',fontSize:11}} tickLine={false} axisLine={false} interval={4} />
              <YAxis tick={{fill:'#6b7280',fontSize:11}} tickLine={false} axisLine={false} domain={['auto','auto']} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{backgroundColor:'#1f2937',border:'none',borderRadius:'8px',color:'white'}}
                formatter={(value: any) => [`$${value}`, 'Price']}
              />
              <Line type="monotone" dataKey="price" stroke={isPositive ? '#4ade80' : '#f87171'} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
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
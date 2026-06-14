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
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',fontFamily:'sans-serif'}}>

      {/* Hero Section */}
      <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'6rem 2rem 4rem',textAlign:'center'}}>
        
        {/* Badge */}
        <div style={{backgroundColor:'#1e3a5f',border:'1px solid #2563eb',borderRadius:'999px',padding:'0.35rem 1rem',fontSize:'0.8rem',color:'#60a5fa',marginBottom:'1.5rem',display:'inline-block'}}>
          📊 Professional Equity Research Tools
        </div>

        {/* Headline */}
        <h1 style={{fontSize:'3.5rem',fontWeight:'800',margin:'0 0 1rem 0',lineHeight:'1.1',maxWidth:'700px'}}>
          Research Stocks Like a{' '}
          <span style={{background:'linear-gradient(90deg, #3b82f6, #8b5cf6)',WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent'}}>
            Wall Street Analyst
          </span>
        </h1>

        <p style={{color:'#9ca3af',fontSize:'1.1rem',margin:'0 0 2.5rem 0',maxWidth:'500px',lineHeight:'1.6'}}>
          Live prices, financial metrics, DCF valuation, and AI-powered equity summaries — all in one place.
        </p>

        {/* Search Bar */}
        <div style={{width:'100%',maxWidth:'560px',position:'relative'}}>
          <div style={{position:'relative'}}>
            <span style={{position:'absolute',left:'1rem',top:'50%',transform:'translateY(-50%)',color:'#6b7280',fontSize:'1.1rem'}}>🔍</span>
            <input
              type="text"
              value={query}
              onChange={searchStocks}
              placeholder="Search stocks... (e.g. AAPL, TSLA, NVDA)"
              style={{width:'100%',padding:'1rem 1rem 1rem 2.75rem',backgroundColor:'#111827',color:'white',border:'2px solid #1f2937',borderRadius:'12px',fontSize:'1rem',outline:'none',boxSizing:'border-box',transition:'border-color 0.2s'}}
              onFocus={e => e.target.style.borderColor = '#3b82f6'}
              onBlur={e => e.target.style.borderColor = '#1f2937'}
            />
          </div>

          {results.length > 0 && (
            <div style={{position:'absolute',top:'100%',left:0,right:0,backgroundColor:'#111827',border:'1px solid #1f2937',borderRadius:'12px',marginTop:'0.5rem',zIndex:10,overflow:'hidden',boxShadow:'0 20px 40px rgba(0,0,0,0.5)'}}>
              {results.map((stock) => (
                <div
                  key={stock.symbol}
                  onClick={() => router.push(`/stock/${stock.symbol}`)}
                  style={{padding:'0.875rem 1.25rem',cursor:'pointer',borderBottom:'1px solid #1f2937',display:'flex',justifyContent:'space-between',alignItems:'center'}}
                  onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1f2937')}
                  onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span style={{fontWeight:'700',color:'#60a5fa'}}>{stock.symbol}</span>
                  <span style={{color:'#9ca3af',fontSize:'0.875rem'}}>{stock.description}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div style={{display:'flex',gap:'1rem',marginTop:'2rem',flexWrap:'wrap',justifyContent:'center'}}>
          {['AAPL','MSFT','NVDA','TSLA','GOOGL'].map(t => (
            <button
              key={t}
              onClick={() => router.push(`/stock/${t}`)}
              style={{padding:'0.4rem 1rem',backgroundColor:'#111827',color:'#9ca3af',border:'1px solid #1f2937',borderRadius:'8px',cursor:'pointer',fontSize:'0.875rem',fontWeight:'600'}}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#3b82f6'; e.currentTarget.style.color = '#60a5fa' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = '#1f2937'; e.currentTarget.style.color = '#9ca3af' }}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',maxWidth:'900px',margin:'0 auto',padding:'0 2rem 4rem'}}>
        {[
          { icon: '📈', title: 'Live Prices', desc: 'Real-time stock quotes and price change data powered by Finnhub API' },
          { icon: '🔍', title: 'Stock Screener', desc: 'Filter and discover stocks by sector with one click navigation' },
          { icon: '💰', title: 'DCF Calculator', desc: 'Calculate intrinsic value using Discounted Cash Flow analysis' },
        ].map(card => (
          <div key={card.title} style={{backgroundColor:'#111827',border:'1px solid #1f2937',borderRadius:'12px',padding:'1.5rem'}}>
            <p style={{fontSize:'1.75rem',margin:'0 0 0.75rem 0'}}>{card.icon}</p>
            <p style={{fontWeight:'700',margin:'0 0 0.5rem 0'}}>{card.title}</p>
            <p style={{color:'#6b7280',fontSize:'0.875rem',margin:0,lineHeight:'1.5'}}>{card.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
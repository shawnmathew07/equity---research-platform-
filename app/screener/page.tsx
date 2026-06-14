'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

const STOCKS = [
  { ticker: 'AAPL', name: 'Apple Inc', sector: 'Technology', country: 'US' },
  { ticker: 'MSFT', name: 'Microsoft Corp', sector: 'Technology', country: 'US' },
  { ticker: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology', country: 'US' },
  { ticker: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer Cyclical', country: 'US' },
  { ticker: 'TSLA', name: 'Tesla Inc', sector: 'Consumer Cyclical', country: 'US' },
  { ticker: 'JPM', name: 'JPMorgan Chase', sector: 'Financial Services', country: 'US' },
  { ticker: 'JNJ', name: 'Johnson & Johnson', sector: 'Healthcare', country: 'US' },
  { ticker: 'V', name: 'Visa Inc', sector: 'Financial Services', country: 'US' },
  { ticker: 'WMT', name: 'Walmart Inc', sector: 'Consumer Defensive', country: 'US' },
  { ticker: 'XOM', name: 'Exxon Mobil', sector: 'Energy', country: 'US' },
  { ticker: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology', country: 'US' },
  { ticker: 'META', name: 'Meta Platforms', sector: 'Technology', country: 'US' },
  { ticker: 'BAC', name: 'Bank of America', sector: 'Financial Services', country: 'US' },
  { ticker: 'PFE', name: 'Pfizer Inc', sector: 'Healthcare', country: 'US' },
  { ticker: 'NFLX', name: 'Netflix Inc', sector: 'Technology', country: 'US' },
]

const SECTORS = ['All', 'Technology', 'Financial Services', 'Healthcare', 'Consumer Cyclical', 'Consumer Defensive', 'Energy']

export default function ScreenerPage() {
  const [sector, setSector] = useState('All')
  const [search, setSearch] = useState('')
  const router = useRouter()

  const filtered = STOCKS.filter(s => {
    const matchSector = sector === 'All' || s.sector === sector
    const matchSearch = s.ticker.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase())
    return matchSector && matchSearch
  })

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',padding:'2rem',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'900px',margin:'0 auto'}}>

        <h1 style={{fontSize:'2rem',fontWeight:'bold',margin:'0 0 0.25rem 0'}}>🔍 Stock Screener</h1>
        <p style={{color:'#6b7280',margin:'0 0 2rem 0'}}>Filter and discover stocks by sector</p>

        {/* Filters */}
        <div style={{display:'flex',gap:'1rem',marginBottom:'1.5rem',flexWrap:'wrap'}}>
          <input
            type="text"
            placeholder="Search by name or ticker..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{padding:'0.6rem 1rem',backgroundColor:'#111827',color:'white',border:'1px solid #374151',borderRadius:'8px',fontSize:'0.9rem',outline:'none',minWidth:'220px'}}
          />
          <select
            value={sector}
            onChange={e => setSector(e.target.value)}
            style={{padding:'0.6rem 1rem',backgroundColor:'#111827',color:'white',border:'1px solid #374151',borderRadius:'8px',fontSize:'0.9rem',outline:'none',cursor:'pointer'}}
          >
            {SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>

        {/* Results count */}
        <p style={{color:'#6b7280',fontSize:'0.85rem',marginBottom:'1rem'}}>{filtered.length} stocks found</p>

        {/* Stock Table */}
        <div style={{backgroundColor:'#111827',borderRadius:'12px',overflow:'hidden'}}>
          <div style={{display:'grid',gridTemplateColumns:'1fr 2fr 1.5fr',padding:'0.75rem 1.5rem',borderBottom:'1px solid #1f2937'}}>
            <p style={{color:'#6b7280',fontSize:'0.8rem',margin:0,fontWeight:'600'}}>TICKER</p>
            <p style={{color:'#6b7280',fontSize:'0.8rem',margin:0,fontWeight:'600'}}>COMPANY</p>
            <p style={{color:'#6b7280',fontSize:'0.8rem',margin:0,fontWeight:'600'}}>SECTOR</p>
          </div>
          {filtered.map((stock, i) => (
            <div
              key={stock.ticker}
              onClick={() => router.push(`/stock/${stock.ticker}`)}
              style={{display:'grid',gridTemplateColumns:'1fr 2fr 1.5fr',padding:'1rem 1.5rem',borderBottom: i < filtered.length - 1 ? '1px solid #1f2937' : 'none',cursor:'pointer',transition:'background 0.15s'}}
              onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#1f2937')}
              onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              <p style={{fontWeight:'700',margin:0,color:'#60a5fa'}}>{stock.ticker}</p>
              <p style={{margin:0,color:'white'}}>{stock.name}</p>
              <p style={{margin:0,color:'#9ca3af',fontSize:'0.875rem'}}>{stock.sector}</p>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}
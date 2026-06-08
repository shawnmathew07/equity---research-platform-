'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchWatchlist = async () => {
      const { data, error } = await supabase
        .from('watchlist')
        .select('*')
        .eq('user_id', 'guest')
      if (!error) setWatchlist(data || [])
      setLoading(false)
    }
    fetchWatchlist()
  }, [])

  const removeFromWatchlist = async (id: number) => {
    await supabase.from('watchlist').delete().eq('id', id)
    setWatchlist(watchlist.filter(item => item.id !== id))
  }

  if (loading) return (
    <div style={{color:'white',padding:'2rem'}}>Loading...</div>
  )

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',padding:'2rem',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'700px',margin:'0 auto'}}>

        <h1 style={{fontSize:'2rem',fontWeight:'bold',marginBottom:'0.25rem'}}>My Watchlist</h1>
        <p style={{color:'#6b7280',marginBottom:'2rem'}}>Stocks you're tracking</p>

        {watchlist.length === 0 ? (
          <div style={{backgroundColor:'#111827',borderRadius:'12px',padding:'2rem',textAlign:'center',color:'#6b7280'}}>
            No stocks saved yet. Go search for a stock and click "Add to Watchlist"!
          </div>
        ) : (
          <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
            {watchlist.map((item) => (
              <div
                key={item.id}
                style={{backgroundColor:'#111827',borderRadius:'12px',padding:'1rem 1.5rem',display:'flex',justifyContent:'space-between',alignItems:'center'}}
              >
                <div
                  onClick={() => router.push(`/stock/${item.ticker}`)}
                  style={{cursor:'pointer'}}
                >
                  <p style={{fontWeight:'700',fontSize:'1.1rem',margin:0}}>{item.ticker}</p>
                  <p style={{color:'#9ca3af',fontSize:'0.875rem',margin:0}}>{item.company_name}</p>
                </div>
                <button
                  onClick={() => removeFromWatchlist(item.id)}
                  style={{padding:'0.4rem 1rem',backgroundColor:'#7f1d1d',color:'#fca5a5',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600'}}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}

        <button
          onClick={() => router.push('/')}
          style={{marginTop:'2rem',padding:'0.6rem 1.5rem',backgroundColor:'#1f2937',color:'white',border:'none',borderRadius:'8px',cursor:'pointer',fontWeight:'600'}}
        >
          ← Search More Stocks
        </button>

      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function DCFPage() {
  const [fcf, setFcf] = useState('')
  const [growthRate, setGrowthRate] = useState('')
  const [discountRate, setDiscountRate] = useState('')
  const [terminalGrowth, setTerminalGrowth] = useState('')
  const [shares, setShares] = useState('')
  const [result, setResult] = useState<any>(null)
  const router = useRouter()

  const calculateDCF = () => {
    const FCF = parseFloat(fcf)
    const g = parseFloat(growthRate) / 100
    const r = parseFloat(discountRate) / 100
    const tg = parseFloat(terminalGrowth) / 100
    const S = parseFloat(shares)

    if (!FCF || !g || !r || !tg || !S || r <= tg) {
      alert('Please fill all fields correctly. Discount rate must be greater than terminal growth rate.')
      return
    }

    // Project FCF for 5 years and discount
    let totalPV = 0
    let projectedFCF = FCF
    const yearlyData = []

    for (let year = 1; year <= 5; year++) {
      projectedFCF = projectedFCF * (1 + g)
      const pv = projectedFCF / Math.pow(1 + r, year)
      totalPV += pv
      yearlyData.push({
        year,
        fcf: projectedFCF.toFixed(2),
        pv: pv.toFixed(2)
      })
    }

    // Terminal value
    const terminalValue = (projectedFCF * (1 + tg)) / (r - tg)
    const terminalPV = terminalValue / Math.pow(1 + r, 5)
    totalPV += terminalPV

    const intrinsicValue = totalPV / S

    setResult({ intrinsicValue: intrinsicValue.toFixed(2), totalPV: totalPV.toFixed(2), terminalPV: terminalPV.toFixed(2), yearlyData })
  }

  return (
    <div style={{minHeight:'100vh',backgroundColor:'#030712',color:'white',padding:'2rem',fontFamily:'sans-serif'}}>
      <div style={{maxWidth:'800px',margin:'0 auto'}}>

        <h1 style={{fontSize:'2rem',fontWeight:'bold',margin:'0 0 0.25rem 0'}}>💰 DCF Calculator</h1>
        <p style={{color:'#6b7280',margin:'0 0 2rem 0'}}>Estimate the intrinsic value of a stock using Discounted Cash Flow analysis</p>

        {/* Input Grid */}
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',backgroundColor:'#111827',borderRadius:'12px',padding:'1.5rem',marginBottom:'1.5rem'}}>
          <div>
            <p style={{color:'#9ca3af',fontSize:'0.8rem',margin:'0 0 0.5rem 0'}}>Free Cash Flow (in millions $)</p>
            <input
              type="number"
              placeholder="e.g. 100000"
              value={fcf}
              onChange={e => setFcf(e.target.value)}
              style={{width:'100%',padding:'0.6rem',backgroundColor:'#1f2937',color:'white',border:'1px solid #374151',borderRadius:'8px',fontSize:'0.95rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div>
            <p style={{color:'#9ca3af',fontSize:'0.8rem',margin:'0 0 0.5rem 0'}}>FCF Growth Rate (%)</p>
            <input
              type="number"
              placeholder="e.g. 10"
              value={growthRate}
              onChange={e => setGrowthRate(e.target.value)}
              style={{width:'100%',padding:'0.6rem',backgroundColor:'#1f2937',color:'white',border:'1px solid #374151',borderRadius:'8px',fontSize:'0.95rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div>
            <p style={{color:'#9ca3af',fontSize:'0.8rem',margin:'0 0 0.5rem 0'}}>Discount Rate / WACC (%)</p>
            <input
              type="number"
              placeholder="e.g. 10"
              value={discountRate}
              onChange={e => setDiscountRate(e.target.value)}
              style={{width:'100%',padding:'0.6rem',backgroundColor:'#1f2937',color:'white',border:'1px solid #374151',borderRadius:'8px',fontSize:'0.95rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div>
            <p style={{color:'#9ca3af',fontSize:'0.8rem',margin:'0 0 0.5rem 0'}}>Terminal Growth Rate (%)</p>
            <input
              type="number"
              placeholder="e.g. 3"
              value={terminalGrowth}
              onChange={e => setTerminalGrowth(e.target.value)}
              style={{width:'100%',padding:'0.6rem',backgroundColor:'#1f2937',color:'white',border:'1px solid #374151',borderRadius:'8px',fontSize:'0.95rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
          <div style={{gridColumn:'1 / -1'}}>
            <p style={{color:'#9ca3af',fontSize:'0.8rem',margin:'0 0 0.5rem 0'}}>Shares Outstanding (in millions)</p>
            <input
              type="number"
              placeholder="e.g. 15441"
              value={shares}
              onChange={e => setShares(e.target.value)}
              style={{width:'100%',padding:'0.6rem',backgroundColor:'#1f2937',color:'white',border:'1px solid #374151',borderRadius:'8px',fontSize:'0.95rem',outline:'none',boxSizing:'border-box'}}
            />
          </div>
        </div>

        <button
          onClick={calculateDCF}
          style={{width:'100%',padding:'0.75rem',backgroundColor:'#2563eb',color:'white',border:'none',borderRadius:'8px',fontWeight:'700',fontSize:'1rem',cursor:'pointer',marginBottom:'1.5rem'}}
        >
          Calculate Intrinsic Value
        </button>

        {/* Results */}
        {result && (
          <div>
            {/* Intrinsic Value */}
            <div style={{backgroundColor:'#111827',borderRadius:'12px',padding:'1.5rem',marginBottom:'1rem',textAlign:'center'}}>
              <p style={{color:'#9ca3af',fontSize:'0.85rem',margin:'0 0 0.5rem 0'}}>Estimated Intrinsic Value Per Share</p>
              <p style={{fontSize:'3rem',fontWeight:'bold',margin:'0',color:'#4ade80'}}>${result.intrinsicValue}</p>
              <p style={{color:'#6b7280',fontSize:'0.8rem',margin:'0.5rem 0 0 0'}}>Total Enterprise Value: ${parseFloat(result.totalPV).toLocaleString()}M</p>
            </div>

            {/* Year by Year */}
            <div style={{backgroundColor:'#111827',borderRadius:'12px',overflow:'hidden'}}>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'0.75rem 1.5rem',borderBottom:'1px solid #1f2937'}}>
                <p style={{color:'#6b7280',fontSize:'0.8rem',margin:0,fontWeight:'600'}}>YEAR</p>
                <p style={{color:'#6b7280',fontSize:'0.8rem',margin:0,fontWeight:'600'}}>PROJECTED FCF ($M)</p>
                <p style={{color:'#6b7280',fontSize:'0.8rem',margin:0,fontWeight:'600'}}>PRESENT VALUE ($M)</p>
              </div>
              {result.yearlyData.map((row: any) => (
                <div key={row.year} style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'0.75rem 1.5rem',borderBottom:'1px solid #1f2937'}}>
                  <p style={{margin:0,fontWeight:'600'}}>Year {row.year}</p>
                  <p style={{margin:0,color:'#9ca3af'}}>${parseFloat(row.fcf).toLocaleString()}</p>
                  <p style={{margin:0,color:'#60a5fa'}}>${parseFloat(row.pv).toLocaleString()}</p>
                </div>
              ))}
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr 1fr',padding:'0.75rem 1.5rem'}}>
                <p style={{margin:0,fontWeight:'600'}}>Terminal Value</p>
                <p style={{margin:0,color:'#9ca3af'}}>—</p>
                <p style={{margin:0,color:'#60a5fa'}}>${parseFloat(result.terminalPV).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
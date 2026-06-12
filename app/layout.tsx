import './globals.css'
import Navbar from './components/Navbar'

export const metadata = {
  title: 'Equity Research Platform',
  description: 'Search stocks and get instant insights',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{margin:0, backgroundColor:'#030712'}}>
        <Navbar />
        {children}
      </body>
    </html>
  )
}
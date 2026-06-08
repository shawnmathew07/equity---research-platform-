import './globals.css'

export const metadata = {
  title: 'Equity Research Platform',
  description: 'Search stocks and get instant insights',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white">
        {children}
      </body>
    </html>
  )
}
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Detect from './pages/Detect'
import Monitoring from './pages/Monitoring'

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-[#0F0F0F]">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/detect" element={<Detect />} />
            <Route path="/monitoring" element={<Monitoring />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  )
}

export default App

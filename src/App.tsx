import Header from './components/Header'
import Home from './components/Home'

function App() {
  return (
    <div className={`relative h-[100svh] flex flex-col bg-slate-200 font-[Lato] text-slate-800 text-base sm:text-lg md:text-xl lg:text-2xl`}>
      <Header />
      <Home />
    </div>
  )
}

export default App

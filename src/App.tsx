import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center p-8">
      <div className="flex space-x-8 mb-8">
        <a href="https://vite.dev" target="_blank" className="hover:opacity-80 transition-opacity">
          <img src={viteLogo} className="w-24 h-24 animate-spin" alt="Vite logo" style={{animationDuration: '20s'}} />
        </a>
        <a href="https://react.dev" target="_blank" className="hover:opacity-80 transition-opacity">
          <img src={reactLogo} className="w-24 h-24 animate-spin" alt="React logo" style={{animationDuration: '10s'}} />
        </a>
      </div>
      
      <h1 className="text-4xl font-bold 
       text-blue-500 mb-8">sunny funda</h1>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
        <button 
          onClick={() => setCount((count) => count + 1)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
        >
          count is {count}
        </button>
        <p className="mt-4 text-gray-600 dark:text-gray-300">
          Edit <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm font-mono">src/App.tsx</code> and save to test HMR
        </p>
      </div>
      
      <p className="text-gray-500 dark:text-gray-400 text-center max-w-md">
        Click on the Vite and React logos to learn more
      </p>
      
      {/* Tailwind CSS Test Section */}
      <div className="mt-8 p-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-xl shadow-2xl">
        <h2 className="text-white text-2xl font-bold mb-4 text-center">🎨 Tailwind CSS Test</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-blue-500 h-16 rounded-lg flex items-center justify-center text-white font-semibold">Blue</div>
          <div className="bg-green-500 h-16 rounded-lg flex items-center justify-center text-white font-semibold">Green</div>
          <div className="bg-yellow-500 h-16 rounded-lg flex items-center justify-center text-white font-semibold">Yellow</div>
        </div>
        <p className="text-white text-center mt-4 font-medium">
          ✅ If you see colorful boxes above, Tailwind CSS is working!
        </p>
      </div>
    </div>
  )
}

export default App

import React from 'react'
import ConfigForm from './components/ConfigForm'

function App() {
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-900 py-8 px-6 shadow rounded-lg sm:px-10">
          <h1 className="text-2xl font-bold text-gray-100 mb-6">Project Configuration</h1>
          <ConfigForm />
        </div>
      </div>
    </div>
  )
}

export default App

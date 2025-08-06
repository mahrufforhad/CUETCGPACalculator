"use client";

export default function Offline() {
  return (
    <main>
      <div className="container">
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">You are currently offline</h1>
          <p className="text-lg mb-6">Please check your internet connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      </div>
    </main>
  )
}

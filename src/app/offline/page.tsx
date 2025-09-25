"use client";

export const dynamic = "force-static";

export default function OfflinePage() {
  return (
    <main className="min-h-screen bg-[rgb(18,18,22)] text-white flex items-center justify-center p-4 sm:p-8">
      <div className="text-center max-w-md mx-auto">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-4">You&rsquo;re Offline</h1>
        <p className="text-gray-300 mb-6 leading-relaxed">
          Don&rsquo;t worry! Some features are still available offline. Check your internet connection to access all content.
        </p>
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-2">Available Offline:</h2>
          <ul className="text-sm text-gray-300 text-left space-y-1">
            <li>• Previously loaded content</li>
            <li>• Basic app navigation</li>
            <li>• Cached study materials</li>
          </ul>
        </div>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors duration-200 font-medium"
        >
          Try Again
        </button>
      </div>
    </main>
  );
}



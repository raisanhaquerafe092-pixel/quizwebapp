export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-pink-800 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-white mb-4">পৃষ্ঠা পাওয়া যায়নি</h2>
        <p className="text-blue-200 mb-8">আপনি যে পৃষ্ঠা খুঁজছেন তা খুঁজে পাওয়া যায়নি।</p>
        <a
          href="/"
          className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-xl transition-all duration-300 transform hover:scale-105"
        >
          হোমে ফিরে যান
        </a>
      </div>
    </div>
  );
}
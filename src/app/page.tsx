import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[rgb(18,18,22)] text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-2">
          Simple Study & Quiz Webapp
        </h1>
        <p className="text-center text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
          Master your studies with interactive quizzes and comprehensive learning materials
        </p>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md mx-auto">
          <div className="grid gap-6">
            {/* Exam Button */}
            <Link href="/exam" className="group block">
              <div className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="text-4xl mb-3">📝</div>
                <h2 className="text-xl font-semibold mb-2">Take Exam</h2>
                <p className="text-blue-100 text-sm">Test your knowledge with practice exams</p>
              </div>
            </Link>

            {/* Study Button */}
            <Link href="/study" className="group block">
              <div className="bg-green-600 hover:bg-green-700 transition-all duration-200 rounded-xl p-6 text-center shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="text-4xl mb-3">📚</div>
                <h2 className="text-xl font-semibold mb-2">Study Materials</h2>
                <p className="text-green-100 text-sm">Access comprehensive learning resources</p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="px-4 py-6 text-center text-gray-400 text-sm">
        <p>📱 Install this app on your device for offline access</p>
      </footer>
    </div>
  )
}

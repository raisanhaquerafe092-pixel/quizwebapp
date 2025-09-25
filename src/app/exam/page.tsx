import Image from "next/image"
import Arr from  "@/../public/left-arrow.png"
import Link from "next/link"

export default function ExamPage() {
  return (
    <div className="min-h-screen bg-[rgb(18,18,22)] text-white">
      {/* Header with Navigation */}
      <header className="flex items-center justify-between p-4 sm:p-6">
        <Link href="/" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
          <Image src={Arr} alt="back" width={24} height={24} className="rotate-0"/>
          <span className="text-sm">Back to Home</span>
        </Link>
        <div className="text-2xl">📝</div>
      </header>

      {/* Main Content */}
      <main className="px-4 sm:px-6 lg:px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Title Section */}
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Practice Exams
            </h1>
            <p className="text-gray-300 text-sm sm:text-base max-w-2xl mx-auto">
              Test your knowledge with comprehensive practice exams. Choose your exam category below.
            </p>
          </div>

          {/* Exam Categories */}
          <div className="grid gap-6 sm:grid-cols-2 max-w-2xl mx-auto">
            {/* General Exam */}
            <Link href="/genaral" className="group block">
              <div className="bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 transition-all duration-300 rounded-xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="text-5xl mb-4">🎨</div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">General Studies</h2>
                <p className="text-purple-100 text-sm leading-relaxed mb-4">
                  Comprehensive general knowledge and academic subjects
                </p>
                <div className="bg-purple-800 bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs text-purple-200">Multiple subjects available</p>
                </div>
              </div>
            </Link>

            {/* Vocational Exam */}
            <Link href="/vocational" className="group block">
              <div className="bg-gradient-to-br from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 transition-all duration-300 rounded-xl p-6 sm:p-8 text-center shadow-lg hover:shadow-xl transform hover:scale-105">
                <div className="text-5xl mb-4">🔧</div>
                <h2 className="text-xl sm:text-2xl font-semibold mb-2">Vocational Studies</h2>
                <p className="text-orange-100 text-sm leading-relaxed mb-4">
                  Technical and vocational skill assessments
                </p>
                <div className="bg-orange-800 bg-opacity-50 rounded-lg p-3">
                  <p className="text-xs text-orange-200">Specialized training topics</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4 text-center">💡 Exam Tips</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 text-sm text-gray-300">
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Review materials before starting</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Take your time to read questions carefully</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400">✓</span>
                <span>Use the process of elimination</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

import Link from "next/link"
import Image from "next/image"

export default function BanglaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 text-white">
      {/* Header Section */}
      <div className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <Link 
          href="/start"
          className="inline-flex items-center gap-2 mb-8 text-blue-200 hover:text-white transition-colors duration-200 group"
        >
          <Image 
            src="/left-arrow.png" 
            alt="Back" 
            width={35} 
            height={35}
            className="group-hover:scale-110 transition-transform duration-200" 
          />
          <span className="font-medium">পিছনে যান</span>
        </Link>

        {/* Main Title */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 bg-clip-text text-transparent mb-4">
            ভোকেশনাল বাংলা
          </h1>
          <p className="text-lg md:text-xl text-blue-100 opacity-90">
            নবম শ্রেণি - প্রশ্নের ধরণ নির্বাচন করুন
          </p>
        </div>

        {/* Question Type Cards */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MCQ Card */}
            <Link href="/vocational/nine/bangla/mcq">
              <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">MCQ</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-blue-200 transition-colors">
                    বহুনির্বাচনি প্রশ্ন
                  </h3>
                  <p className="text-blue-100/80 text-sm md:text-base">
                    সঠিক উত্তর বেছে নিন
                  </p>
                </div>
              </div>
            </Link>

            {/* Short Question Card */}
            <Link href="/vocational/nine/bangla/short">
              <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">সংক্ষিপ্ত</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-purple-200 transition-colors">
                    সংক্ষিপ্ত প্রশ্ন
                  </h3>
                  <p className="text-blue-100/80 text-sm md:text-base">
                    সংক্ষেপে উত্তর দিন
                  </p>
                </div>
              </div>
            </Link>

            {/* Long Question Card */}
            <Link href="/vocational/nine/bangla/long">
              <div className="group bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:border-white/30 transition-all duration-300 hover:scale-105 hover:shadow-2xl cursor-pointer">
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-orange-400 to-red-500 rounded-full flex items-center justify-center group-hover:rotate-12 transition-transform duration-300">
                    <span className="text-2xl font-bold text-white">বর্ণনা</span>
                  </div>
                  <h3 className="text-xl md:text-2xl font-semibold mb-2 group-hover:text-orange-200 transition-colors">
                    বর্ণনামূলক প্রশ্ন
                  </h3>
                  <p className="text-blue-100/80 text-sm md:text-base">
                    বিস্তারিত উত্তর দিন
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-blue-200/70 text-sm">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>সব প্রশ্ন অনলাইন ডেটাবেস থেকে আনা হয়</span>
          </div>
        </div>
      </div>
    </div>
  )
}

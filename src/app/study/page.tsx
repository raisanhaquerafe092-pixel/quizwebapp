import Link from "next/link";

export default function page() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(18,18,22)", color: "white" }}>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Study Hub</h1>
        <p className="opacity-80 mb-6 text-center">
          Choose your class to start studying subjects with notes and practice quizzes.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link href="/vocational/nine" className="block">
            <div className="p-6 rounded-xl border border-white/20 hover:border-white/40 transition">
              <h2 className="text-2xl font-semibold">Class Nine</h2>
              <p className="opacity-80">All subjects: MCQ, Short, Long practice.</p>
            </div>
          </Link>
          <Link href="/vocational/ten" className="block">
            <div className="p-6 rounded-xl border border-white/20 hover:border-white/40 transition">
              <h2 className="text-2xl font-semibold">Class Ten</h2>
              <p className="opacity-80">All subjects: MCQ, Short, Long practice.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  )
}

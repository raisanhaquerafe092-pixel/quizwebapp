import Link from "next/link";

async function getChapters() {
  const res = await fetch("http://127.0.0.1:8000/content/chapter/?class_name=nine&subject=bangla", { cache: "no-store" });
  if (!res.ok) return [];
  return res.json();
}

export default async function ChapterList() {
  const chapters = await getChapters();
  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(18,18,22)", color: "white" }}>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">Bangla Chapters (Class Nine)</h1>
        <div className="space-y-3">
          {chapters.map((c: any) => (
            <Link key={c.id} href={`/vocational/nine/bangla/chapter/${c.id}`} className="block">
              <div className="p-4 rounded-xl border border-white/20 hover:border-white/40 transition">
                <div className="font-semibold">{c.index}. {c.title}</div>
              </div>
            </Link>
          ))}
          {chapters.length === 0 && <p className="opacity-70">No chapters yet.</p>}
        </div>
      </div>
    </div>
  )
}



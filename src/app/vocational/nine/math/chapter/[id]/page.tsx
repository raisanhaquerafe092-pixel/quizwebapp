import SubjectQuizPage from "@/components/SubjectQuizPage";

async function getChapter(id: string) {
  const res = await fetch(`http://127.0.0.1:8000/content/chapter/${id}/", { cache: "no-store" });
  if (!res.ok) return null;
  return res.json();
}

export default async function ChapterDetail({ params }: { params: { id: string } }) {
  const chapter = await getChapter(params.id);
  return (
    <div className="min-h-screen" style={{ backgroundColor: "rgb(18,18,22)", color: "white" }}>
      <div className="max-w-4xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-3">{chapter?.index}. {chapter?.title}</h1>
        {chapter?.content && (
          <div className="prose prose-invert max-w-none">
            <p>{chapter.content}</p>
          </div>
        )}
        <div className="mt-6">
          <SubjectQuizPage classNameValue="nine" />
        </div>
      </div>
    </div>
  )
}



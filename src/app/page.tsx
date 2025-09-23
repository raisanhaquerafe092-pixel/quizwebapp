import Link from "next/link"


export default function page() {
  return (
   <div className="bg-[rgb(18,18,22)] text-[rgb(255,255,255)] h-screen">
    <h1 className="text-5xl text-center mt-5" >Simple Study & Quiz Webapp</h1>
    <div className="btns justify-center align-center grid gap-10 mt-60">
    <button><Link href ="/exam">Exam</Link></button>
    <button><Link href ="/study">Study</Link></button>
    </div>

   </div>
  )
}

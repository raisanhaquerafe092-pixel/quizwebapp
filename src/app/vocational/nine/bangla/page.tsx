import Link from "next/link"
import Image from "next/image"
import Arr from  "@/../public/left-arrow.png"

export default function page() {
  return (

    <div>
        <h1 className="text-5xl text-center">This is a Vocational Bangla page
        </h1>
        <Link className="mt-10" href="/start">
        <Image src={Arr} alt="left-arrow" width={35} height={35}/>
        </Link>
        <div className="btns gid gap-10 justify-center align-center mt-50">
        <button><Link href ="/vocational/nine/bangla/mcq">M.C.Q.</Link></button>
          <button><Link href ="/vocational/nine/bangla/short">Short Question</Link></button>
           <button><Link href ="/vocational/nine/bangla/long">Long Question </Link></button>
           </div>
    </div>
  )
}

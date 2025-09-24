import Link from "next/link"
import Image from "next/image"
import Arr from  "@/../public/left-arrow.png"

export default function page() {
  return (

    <div>
        <h1 className="text-5xl text-center">This is a Vocational Englsih  page
        </h1>
        <Link className="mt-10" href="/start">
        <Image src={Arr} alt="left-arrow" width={35} height={35}/>
        </Link>
        <div className="btns justify-center align-center grid gap-10 mt-60">
            
    <button><Link href ="/vocational/nine">Class-Nine</Link></button>
    <button><Link href ="/vocational/ten">Class-Ten</Link></button>
    </div>
      
    </div>
  )
}

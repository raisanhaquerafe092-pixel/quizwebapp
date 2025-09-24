import Image from "next/image"
import Arr from  "@/../public/left-arrow.png"
import Link from "next/link"
export default function page() {
  return (
    <div>
        <h1 className="text-4xl text-center">This is a exam site</h1>
        <Link className="mt-10" href="/start">
        <Image src={Arr} alt="left-arrow" width={35} height={35}/>
        </Link>
        <div className="classes justify-center align-center grid gap-10 mt-60">
          <button><Link href ="/genaral">Genaral</Link></button>
    <button><Link href ="/vocational">Vocational</Link></button>
          
        </div>

    </div>
  )
}

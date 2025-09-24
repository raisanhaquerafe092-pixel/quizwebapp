import Link from "next/link"
import Image from "next/image"
import Arr from  "@/../public/left-arrow.png"

export default function page() {
  return (
    <div>
        <h1 className="text-center text-4xl">This is a Vocational Nine page </h1>
        <Link className="mt-10" href="">
        <Image src={Arr} alt="left-arrow" width={35} height={35}/>
        </Link>
        <div className="btns justify-center align-center grid gap-10 mt-20">
    <button className="min-h-min" ><Link href ="/vocational/nine/bangla">বাংলা (Bangla)</Link></button>
    <button  className="min-h-min"><Link href ="/vocational/nine/english">ইংরেজি (English)</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/math">গণিত (Mathematics)</Link></button>
    <button className="min-h-min" ><Link href ="/vocational/nine/baobi">বাংলাদেশ ও বিশ্বপরিচয় (BGS)</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/dhormo">ধর্ম</Link></button>
    <button  className="min-h-min"><Link href ="/vocational/nine/ict">তথ্য ও যোগাযোগ প্রযুক্তি (ICT)</Link></button>
    <button className="min-h-min"> <Link href ="/vocational/nine/physics">পদার্থবিজ্ঞান (Physics)</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/chemistry">রসায়ন (Chemistry)</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/biology">জীববিজ্ঞান (Biology)</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/computer">Computer & Information Technology</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/electrical">Electronics Technology</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/rac">Refrigeration and Air Conditioning (RAC)</Link></button>
    <button className="min-h-min"><Link href ="/vocational/nine/automobile">Automobile Technology</Link></button>
    </div>
      
    </div>
  )
}

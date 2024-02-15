import { GitCommit, GithubIcon } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <div className=" bg-gradient-to-r from-orange-600 to-yellow-600 h-20 flex items-center justify-between px-2 font-serif">
      <div className="text-xl font-bold">
        Made by{' '}
        <Link
          href="https://faisal-husain.vercel.app"
          target="_blank"
          className="hover:underline "
        >
          {' '}
          Faisal{' '}
        </Link>
      </div>
      <div>
        <Link href="https://github.com/faisal004/topask" className="flex items-center justify-center gap-2 cursor-pointer">
          <GithubIcon className="rounded-full bg-black text-white h-8 w-8 p-1" />
        </Link>
      </div>
    </div>
  )
}

export default Footer

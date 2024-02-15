import { Button } from '@/components/ui/button'

const Hero = () => {
  return (
    <div className="pt-16 flex flex-col  items-center justify-center gap-3 md:h-[500px] h-full  relative bg-gradient-to-b from-slate-200 to-gray-200">
      <div className="absolute h-80 w-80 bg-yellow-400 animate-blob top-7 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="absolute h-80 w-80 bg-red-400 animate-blob right-40 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="absolute h-80 w-80 bg-orange-400 animate-blob left-0 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>

      {/* <div className='pb-5'>
      <button className="bg-slate-800 no-underline group cursor-pointer relative shadow-2xl shadow-zinc-900 rounded-full p-px text-xs font-semibold leading-6  text-white inline-block ">
        <span className="absolute inset-0 overflow-hidden rounded-full">
          <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(56,189,248,0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
        </span>
        <div className="relative flex space-x-2 items-center z-10 rounded-full bg-zinc-950 py-0.5 px-4 ring-1 ring-white/10 ">
          <span>{`Answer what's important for everyone`}</span>
        </div>
        <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-emerald-400/0 via-emerald-400/90 to-emerald-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
      </button>
      </div> */}

      <div className="text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-yellow-600">
        TopAsk
      </div>
      <div className="text-3xl font-serif font-semibold text-center px-2 md:w-[70%] w-[80%]">
        Join the room, ask your question, watch it climb: <br /> It&apos;s
        TopAsk time!
      </div>
      <p className="md:w-[55%] w-[80%] text-center text-base px-2 pb-3">
      Our platform enables users to create discussion rooms, post questions, and upvote relevant questions. Through collaborative engagement, participants prioritize topics, which need to be answered first.
      </p>
      <div className="">
        <button
          onClick={() => {
            window.scrollBy({
              top: window.innerHeight,
              behavior: 'smooth',
            })
          }}
          className="bg-gradient-to-b  from-orange-600 to-yellow-500 rounded-full cursor-pointer h-12 w-44 text-white opacity-100"
        >
          How does it work?
        </button>
      </div>
    </div>
  )
}

export default Hero

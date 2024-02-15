import { EyeIcon } from 'lucide-react'

const How = () => {
  return (
    <div className=" pt-16 pb-20 bg-gradient-to-b from-slate-200 to-gray-200 flex flex-col items-center justify-start font-serif relative">
          <div className="absolute h-80 w-80 bg-yellow-400 animate-blob top-7 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="absolute h-80 w-80 bg-red-400 animate-blob right-40 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="absolute h-80 w-80 bg-orange-400 animate-blob left-0 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      <div className="md:text-5xl text-4xl mt-2  font-semibold">
        How does it work?
      </div>
      <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-5 mt-10">
        <div className="h-60 w-80 bg-gradient-to-tr from-orange-400 to-yellow-400 rounded-2xl border-2 shadow-lg hover:shadow-orange-600 flex flex-col items-center justify-start p-4">
          <div className="text-3xl  w-full text-left">Create Room</div>
          <div className="leading-5 mt-2">
            Users can create rooms with customizable slow mode settings and
            durations. They can also define voting thresholds for message
            importance levels: normal, important, and highly important. This
            feature enhances user control over chat dynamics and message
            prioritization.{' '}
          </div>
        </div>
        <div className="h-60 w-80 bg-gradient-to-tl from-orange-400 to-yellow-400 rounded-2xl border-2 shadow-lg hover:shadow-orange-600 flex flex-col items-center justify-start p-4">
          <div className="text-3xl  w-full text-left">Join Room</div>
          <div className="leading-5 mt-2">
            User can join room and send their questions.
          </div>
        </div>{' '}
        <div className="h-60 w-80 bg-gradient-to-br from-orange-400 to-yellow-400 rounded-2xl border-2 shadow-lg hover:shadow-orange-600 flex flex-col items-center justify-start p-4">
          <div className="text-3xl  w-full text-left">Upvote</div>
          <div className="leading-5 mt-2">
            Joined user can upvote on other user question.
          </div>
        </div>{' '}
        <div className="h-60 w-80 bg-gradient-to-tl from-orange-400 to-yellow-400 rounded-2xl border-2 shadow-lg hover:shadow-orange-600 flex flex-col items-center justify-start p-4">
          <div className="text-3xl  w-full text-left">Mark as answered</div>
          <div className="leading-5 mt-2">
            Room creator can mark questions as answered.
          </div>
        </div>{' '}
        <div className="h-60 w-80 bg-gradient-to-b from-orange-400 to-yellow-400 rounded-2xl border-2 shadow-lg hover:shadow-orange-600 flex flex-col items-center justify-start p-4">
          <div className="text-3xl  w-full text-left ">
            {' '}
            <span>See answered question</span>{' '}
          </div>
          <div className="leading-5 mt-2">
            Users can see all the answered questions.
          </div>
        </div>{' '}
        <div className="h-60 w-80 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-2xl border-2 shadow-lg hover:shadow-orange-600 flex flex-col items-center justify-start p-4">
          <div className="text-3xl  w-full text-left">
            More features coming...
          </div>
          <div className="leading-5 mt-2">....</div>
        </div>
      </div>
    </div>
  )
}

export default How

export function AvatarStack() {
  return (
    <div className="flex items-center gap-4">
      <div className="flex -space-x-2">
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
          <img src="" alt="User 1" className="w-full h-full object-cover" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
          <img src="" alt="User 2" className="w-full h-full object-cover" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
          <img src="" alt="User 3" className="w-full h-full object-cover" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
          <img src="" alt="User 4" className="w-full h-full object-cover" />
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-300 border-2 border-white overflow-hidden">
          <img src="" alt="User 5" className="w-full h-full object-cover" />
        </div>
      </div>
      <p className="text-sm text-gray-600">3k+ People reviewed worldwide</p>
    </div>
  );
}

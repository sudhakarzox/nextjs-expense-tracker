'use client';

export default function LoadingAnime({title = "Loading..."}) {
  return (
    <>
      <div className="flex items-center px-4 py-2 pl-0 text-gray-500 rounded">
        {title}&nbsp;<div className="pr-1 w-4 h-4 border-3 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    </>
  );
}

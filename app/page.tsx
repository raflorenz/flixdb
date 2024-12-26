import { db } from "@/db";
import { mediaTable } from "@/db/schema";
import Link from "next/link";
import { Suspense } from "react";
import Media from "@/components/media";
import { Skeleton } from "@/components/ui/skeleton";

export default async function Home() {
  return (
    <>
      <section className="flex flex-col justify-center p-8 bg-gray-200 min-h-[400px]">
        <h1 className="mb-12 text-4xl text-[#e50914]">
          Keep track of the movies and tv shows you've already watched <br />
          and discover your next watch based on it.
        </h1>
        <p className="text-lg">Description</p>
        <div className="flex gap-2 mt-12">
          <Link
            href="/discover"
            className="p-4 leading-none bg-[#e50914] font-bold text-white uppercase"
          >
            Discover Movies/TV Shows
          </Link>
          <button className="p-4 leading-none bg-[#e50914] font-bold text-white uppercase">
            Search Movies/TV Shows
          </button>
        </div>
      </section>
      <h2 className="my-12 text-4xl text-[#e50914]">Your watched list</h2>
      <Suspense fallback={<WatchedListSkeleton />}>
        <WatchedList />
      </Suspense>
    </>
  );
}

async function WatchedList() {
  const watchedList = await db.select().from(mediaTable);

  return watchedList.length ? (
    <section className="watched-list grid grid-cols-6 gap-2 mb-12">
      {watchedList.map((media, index) => (
        <Media key={`${index}-${media.id}`} media={media} />
      ))}
    </section>
  ) : (
    <div>
      <h2>
        No movies or tv shows added to your watched list. <br />
        Use the search and discover button above to get started.
      </h2>
    </div>
  );
}

function WatchedListSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="mt-16 mb-8 text-4xl text-[#e50914]">
        Loading movies and tv shows...
      </h2>
      <div className="grid grid-rows-2 grid-flow-col gap-2 pb-2 mb-16 overflow-x-auto">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[2/3] w-[235px]" />
        ))}
      </div>
    </div>
  );
}

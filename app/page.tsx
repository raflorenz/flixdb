import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { Suspense } from "react";
import WatchedList from "@/components/watched-list";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Home() {
  return (
    <>
      <section className="flex flex-col justify-center p-8 bg-gray-200 min-h-[400px]">
        <h1 className="mb-12 text-4xl text-[#e50914]">
          Keep track of your watched movies and tv shows <br />
          then discover more based on it.
        </h1>
        <p className="text-lg">
          Discover thousands of movies and tv shows or search a specific one you
          want to watch <br /> then add the ones you've already watched to your
          list.
        </p>
        <div className="flex gap-2 mt-12">
          <Link
            href="/discover"
            className="p-4 leading-none bg-[#e50914] font-bold text-white uppercase"
          >
            Discover Movies & TV Shows
          </Link>
          <button className="p-4 leading-none bg-[#e50914] font-bold text-white uppercase">
            Search Movies & TV Shows
          </button>
        </div>
      </section>
      <h2 className="my-12 text-4xl text-[#e50914]">Your watched list</h2>
      <Suspense fallback={<WatchedListSkeleton />}>
        <WatchedListWrapper />
      </Suspense>
    </>
  );
}

async function WatchedListWrapper() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const watchedList = await db
    .select()
    .from(media)
    .where(eq(media.userId, session?.user.id));

  return watchedList.length ? (
    <WatchedList watchedList={watchedList} />
  ) : (
    <div>
      <h2>
        No movies and tv shows added to your watched list. <br />
        Use the discover and search button above to get started.
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

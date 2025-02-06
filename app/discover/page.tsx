import { Suspense } from "react";
import { getTrending, getPopular, getTopRated } from "@/lib/api";
import MediaList from "@/components/media-list";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getWatchedListIds } from "@/lib/actions";

export default async function Page() {
  const trendingPromise = getTrending();
  const popularPromise = getPopular();
  const topRatedPromise = getTopRated();

  return (
    <Suspense fallback={<MediaListSkeleton />}>
      <MediaListWrapper promise={trendingPromise} heading="Trending Now" />
      <MediaListWrapper promise={popularPromise} heading="Popular" />
      <MediaListWrapper promise={topRatedPromise} heading="Top Rated" />
    </Suspense>
  );
}

async function MediaListWrapper({
  promise,
  heading,
}: {
  promise: Promise<{}[]>;
  heading: string;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const data = await promise;
  const watchedListIds = await getWatchedListIds(session);
  const mediaList = data.map((item) => {
    return {
      ...item,
      watched: watchedListIds.includes(item.id),
    };
  });

  return <MediaList mediaList={mediaList} heading={heading} />;
}

function MediaListSkeleton() {
  return (
    <div className="space-y-4">
      <h2 className="mt-16 mb-8 text-4xl text-[#e50914]">
        Loading movies and tv shows from TMDB...
      </h2>
      <div className="grid grid-rows-2 grid-flow-col gap-2 pb-2 mb-16 overflow-x-auto">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[2/3] w-[235px]" />
        ))}
      </div>
    </div>
  );
}

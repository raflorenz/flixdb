import { Suspense } from "react";
import MediaDetails from "@/components/media-details";
import { Skeleton } from "@/components/ui/skeleton";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Page({ params }: { params: Promise<string[]> }) {
  return (
    <Suspense fallback={<MediaDetailsSkeleton />}>
      <MediaDetailsWrapper params={params} />
    </Suspense>
  );
}

async function MediaDetailsWrapper({ params }: { params: Promise<string[]> }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <MediaDetails params={params} session={session} />;
}

function MediaDetailsSkeleton() {
  return (
    <>
      <Skeleton className="h-10 w-[50%] my-8" />
      <Skeleton className="h-40 w-full" />
    </>
  );
}

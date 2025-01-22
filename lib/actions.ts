"use server";

import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidateTag } from "next/cache";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function addToWatchedList(mediaItem) {
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      success: false,
      message: "You're not authentiated, sign in to continue.",
    };
  }

  const mediaName = mediaItem.media_type === "movie" ? "Movie" : "TV Show";

  try {
    await db.insert(media).values({
      id: mediaItem.id,
      media_type: mediaItem.media_type,
      title: mediaItem.title,
      name: mediaItem.name,
      poster_path: mediaItem.poster_path,
      release_date: mediaItem.release_date,
      first_air_date: mediaItem.first_air_date,
      vote_average: mediaItem.vote_average,
      number_of_episodes: mediaItem.number_of_episodes,
      runtime: mediaItem.runtime,
      status: mediaItem.status,
      userId: session?.user.id,
    });

    revalidateTag("media-details");

    return {
      success: true,
      message: `${mediaName} added successfully!`,
    };
  } catch (error) {
    console.error(`Failed to add ${mediaName}:`, error);

    return {
      success: false,
      message: `Failed to add ${mediaName}. Please try again.`,
    };
  }
}

export async function getWatchedListIds(session) {
  const results = await db
    .select({ id: media.id })
    .from(media)
    .where(eq(media.userId, session?.user.id));
  const idArray = results.map((row) => row.id);

  return idArray;
}

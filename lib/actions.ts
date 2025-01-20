"use server";

import { db } from "@/db";
import { mediaTable } from "@/db/schema";
import { revalidateTag } from "next/cache";
import { auth } from "./auth";
import { headers } from "next/headers";

export async function addToWatchedList(media) {
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

  const mediaName = media.media_type === "movie" ? "Movie" : "TV Show";

  try {
    await db.insert(mediaTable).values({
      id: media.id,
      media_type: media.media_type,
      title: media.title,
      name: media.name,
      poster_path: media.poster_path,
      release_date: media.release_date,
      first_air_date: media.first_air_date,
      vote_average: media.vote_average,
      number_of_episodes: media.number_of_episodes,
      runtime: media.runtime,
      status: media.status,
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

import { unstable_cacheLife as cacheLife } from "next/cache";

const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const headers = {
  accept: "application/json",
  Authorization: `Bearer ${API_KEY}`,
};

async function fetchMedia(endpoint: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`, { headers });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function fetchMediaDetails(media) {
  try {
    const data = await fetchMedia(`/${media.media_type}/${media.id}`);

    return data;
  } catch (error) {
    console.error(`Error fetching media details for ID ${media.id}:`, error);

    throw error;
  }
}

async function generateUpdatedResults(results) {
  const updatedResults = await Promise.all(
    results.map(async (item) => {
      const { runtime, number_of_episodes, status } = await fetchMediaDetails(
        item
      );

      return {
        id: item.id,
        media_type: item.media_type,
        title: item.title,
        name: item.name,
        release_date: item.release_date,
        first_air_date: item.first_air_date,
        poster_path: item.poster_path,
        vote_average: item.vote_average,
        runtime,
        number_of_episodes,
        status,
      };
    })
  );

  return updatedResults;
}

export async function getTrending() {
  "use cache";
  cacheLife("minutes");

  const [page1, page2] = await Promise.all([
    fetchMedia("/trending/all/day?page=1"),
    fetchMedia("/trending/all/day?page=2"),
  ]);

  const combinedResults = [...page1.results, ...page2.results];

  const updatedResults = generateUpdatedResults(combinedResults);

  return updatedResults;
}

export async function getPopular() {
  "use cache";
  cacheLife("hours");

  const [movies, tvShows] = await Promise.all([
    fetchMedia("/movie/popular"),
    fetchMedia("/tv/popular"),
  ]);

  const combinedResults = [
    ...movies.results.map((item) => ({ ...item, media_type: "movie" })),
    ...tvShows.results.map((item) => ({ ...item, media_type: "tv" })),
  ].sort((a, b) => b.vote_average - a.vote_average);

  const updatedResults = generateUpdatedResults(combinedResults);

  return updatedResults;
}

export async function getTopRated() {
  "use cache";
  cacheLife("days");

  const [movies, tvShows] = await Promise.all([
    fetchMedia("/movie/top_rated"),
    fetchMedia("/tv/top_rated"),
  ]);

  // custom sorting function
  const sortMedia = (a, b) => {
    // first, compare by vote average (highest rated first)
    if (b.vote_average.toFixed(1) !== a.vote_average.toFixed(1)) {
      return b.vote_average - a.vote_average;
    }

    // if vote average is the same, compare by date (oldest date first)
    const dateA = a.release_date || a.first_air_date;
    const dateB = b.release_date || b.first_air_date;

    if (dateA && dateB) {
      return new Date(dateA).getTime() - new Date(dateB).getTime();
    }
  };

  const combinedResults = [
    ...movies.results.map((item) => ({ ...item, media_type: "movie" })),
    ...tvShows.results.map((item) => ({ ...item, media_type: "tv" })),
  ].sort(sortMedia);

  const updatedResults = generateUpdatedResults(combinedResults);

  return updatedResults;
}

import Link from "next/link";
import { formatDate, formatRuntime, slugify } from "@/lib/utils";
import { Star, Film, TvMinimal } from "lucide-react";

export default function WatchedList({ watchedList }) {
  return (
    <section className="watched-list grid grid-cols-1 min-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 mb-12">
      {watchedList.map((media) => (
        <div
          key={media.id}
          className={`media relative${media.poster_path ? "" : " bg-gray-300"}`}
        >
          <Link
            href={`/${media.media_type}/${media.id}/${slugify(
              media.title || media.name
            )}`}
          >
            <div className="poster">
              {media.poster_path ? (
                <img
                  src={`https://image.tmdb.org/t/p/w300${media.poster_path}`}
                />
              ) : (
                <h3 className="absolute flex justify-center items-center w-full h-full text-[2rem] text-[#e50914] uppercase text-center">
                  {media.title || media.name}
                </h3>
              )}
            </div>
            <div className="info flex items-center gap-[3px] top-2 left-2">
              <Star size={15} />
              <span>
                {media.vote_average ? media.vote_average.toFixed(1) : "N/A"}
              </span>
            </div>
            <div className="info top-2 right-2">
              {media.media_type === "movie" ? (
                <Film size={15} />
              ) : (
                <TvMinimal size={15} />
              )}
            </div>
            <div className="info top-2 right-[2.2rem]">
              {media.media_type === "movie"
                ? formatRuntime(media.runtime)
                : `${media.number_of_episodes}ep`}
            </div>
            <div className="info bottom-2 left-2">
              {formatDate(media.release_date || media.first_air_date)}
              {media.first_air_date &&
                (media.status === "Ended" ? " (Ended)" : " (Ongoing)")}
            </div>
          </Link>
        </div>
      ))}
    </section>
  );
}

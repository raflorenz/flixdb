"use client";

import { useState, useTransition } from "react";
import { addToWatchedList } from "@/lib/actions";
import { toast } from "@/hooks/use-toast";
import { authClient } from "@/lib/auth-client";

export default function ButtonAddToWatchedList({ media }) {
  const [isPending, startTransition] = useTransition();
  const [isSuccessfullyAdded, setIsSuccessfullyAdded] = useState(false);

  const handleClick = () => {
    startTransition(async () => {
      const result = await addToWatchedList(media);

      if (result.success) {
        toast({
          description: result.message,
          duration: 3000,
        });
        setIsSuccessfullyAdded(true);
      } else {
        toast({
          description: result.message,
          variant: "destructive",
          duration: 3000,
        });

        await new Promise((resolve) => setTimeout(resolve, 1500));
        await authClient.signIn.social({ provider: "google" });
      }
    });
  };

  return (
    !isSuccessfullyAdded && (
      <button
        className="p-4 mt-8 leading-none bg-[#e50914] font-bold text-white uppercase"
        onClick={handleClick}
        disabled={isPending}
      >
        {isPending ? "Adding to list..." : "Add to watched list"}
      </button>
    )
  );
}

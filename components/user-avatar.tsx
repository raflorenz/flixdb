"use client";

import { authClient } from "@/lib/auth-client";

export default function UserAvatar() {
  const { data } = authClient.useSession();

  if (data) {
    return (
      <button onClick={async () => await authClient.signOut()}>Sign Out</button>
    );
  }
}

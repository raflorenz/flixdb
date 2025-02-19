import Link from "next/link";
import UserAvatar from "./user-avatar";

export default function Header() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="my-8 text-6xl text-[#e50914] uppercase">
        <Link href="/">FlixDB</Link>
      </h1>
      <UserAvatar />
    </header>
  );
}

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-24">
      <h1 className="text-4xl font-bold mb-2">Full Authentication System</h1>
      <p>
        Full Authentication System built with NextJs, Oauth, FastApi , Redis and
        Postgres
      </p>
      <div className="flex items-center justify-center mt-2">
        <Button asChild variant={"secondary"}>
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/dashboard" className="ml-4">
            Get Started
          </Link>
        </Button>
      </div>
    </div>
  );
}

import { notFound } from "next/navigation";

/** Unknown paths render the not-found page of their locale (inside the root layout). */
export default function CatchAllPage() {
  notFound();
}

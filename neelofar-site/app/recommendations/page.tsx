import { getBooks } from "../lib/content-server";
import RecommendationsClient from "./RecommendationsClient";

export default function RecommendationsPage() {
  const books = getBooks();

  return <RecommendationsClient books={books} />;
}

import { getBookRecommendations } from "../lib/content-server";
import RecommendationsClient from "./RecommendationsClient";

export default function RecommendationsPage() {
  const books = getBookRecommendations();

  return <RecommendationsClient books={books} />;
}

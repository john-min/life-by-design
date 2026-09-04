import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Life by Design",
    short_name: "Life by Design",
    description: "A calm, guided introduction to the Designing Your Life framework.",
    start_url: "/",
    display: "standalone",
    background_color: "#f5efe2",
    theme_color: "#72c7ce",
  };
}

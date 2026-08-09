import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/kings/Header";
import { Hero } from "@/components/kings/Hero";
import { Story } from "@/components/kings/Story";
import { Experiences } from "@/components/kings/Experiences";
import { Reserve } from "@/components/kings/Reserve";
import { Footer } from "@/components/kings/Footer";

const title = "Kings Lounge Asaba — Bar, Kitchen, Shisha & Photo Lounge";
const description =
  "Asaba's upscale bar, kitchen and shisha lounge. Browse the full menu in Naira, book a photo shoot, and reserve a table at Kings Lounge, Delta State.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <Header mode="home" />
      <main>
        <Hero />
        <Story />
        <Experiences />
        <Reserve />
      </main>
      <Footer />
    </>
  );
}

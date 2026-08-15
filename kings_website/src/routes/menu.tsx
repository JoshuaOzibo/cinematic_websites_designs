import { createFileRoute } from "@tanstack/react-router";
import { Header } from "@/components/kings/Header";
import { MenuBrowser } from "@/components/kings/MenuBrowser";
import { Footer } from "@/components/kings/Footer";

const title = "Menu — Royal Lounge Asaba";
const description =
  "Explore the upscale food, drinks, champagne, cocktails, and shisha menu at Royal Lounge Asaba.";

export const Route = createFileRoute("/menu")({
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
  component: MenuPage,
});

function MenuPage() {
  return (
    <>
      <Header mode="menu" />
      <main className="pt-[76px]">
        <MenuBrowser />
      </main>
      <Footer />
    </>
  );
}

import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import type { GalleryBlock } from "@/lib/content";
import styles from "./Inspiration.module.css";

const fallback: GalleryBlock = {
  id: "ideas",
  type: "imageGallery",
  overline: "Ideas & inspiration",
  heading: "Print ideas for every kind of business",
  lead: "Menus for cafés, stickers for online brands and uniforms for teams — see what custom printing can do for you.",
  images: [
    {
      caption: "Menus, cards and stickers for cafés",
      image: { url: "/images/idea-cafe.png", alt: "Menus, cards and stickers for cafés", width: 1200, height: 896 },
    },
    {
      caption: "Stickers and inserts for online brands",
      image: {
        url: "/images/idea-packaging.png",
        alt: "Stickers and inserts for online brands",
        width: 1200,
        height: 896,
      },
    },
    {
      caption: "Printed T-shirts for teams and events",
      image: { url: "/images/idea-team.png", alt: "Printed T-shirts for teams and events", width: 1200, height: 896 },
    },
  ],
};

/** Figma SF-HOME-01 · Inspiration (image gallery). */
export function Inspiration({ block = fallback }: { block?: GalleryBlock }) {
  return (
    <section className="container" aria-labelledby={`${block.id}-title`}>
      <div className={styles.section}>
        <SectionHeading
          id={`${block.id}-title`}
          overline={block.overline ?? ""}
          title={block.heading}
          lead={block.lead}
        />
        <ul className={styles.grid}>
          {block.images.map((item) => (
            <li key={item.image.url} className={styles.item}>
              <Image src={item.image.url} alt={item.image.alt} fill sizes="(max-width: 767px) 100vw, 411px" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

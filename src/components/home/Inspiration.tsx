import Image from "next/image";
import { SectionHeading } from "@/components/ui/SectionHeading/SectionHeading";
import styles from "./Inspiration.module.css";

const ideas = [
  { src: "/images/idea-cafe.png", caption: "Menus, cards and stickers for cafés" },
  { src: "/images/idea-packaging.png", caption: "Stickers and inserts for online brands" },
  { src: "/images/idea-team.png", caption: "Printed T-shirts for teams and events" },
];

/** Figma SF-HOME-01 · Inspiration. */
export function Inspiration() {
  return (
    <section className="container" aria-labelledby="ideas-title">
      <div className={styles.section}>
        <SectionHeading
          id="ideas-title"
          overline="Ideas & inspiration"
          title="Print ideas for every kind of business"
          lead="Menus for cafés, stickers for online brands and uniforms for teams — see what custom printing can do for you."
        />
        <ul className={styles.grid}>
          {ideas.map((idea) => (
            <li key={idea.src} className={styles.item}>
              <Image src={idea.src} alt={idea.caption} fill sizes="(max-width: 767px) 100vw, 411px" />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

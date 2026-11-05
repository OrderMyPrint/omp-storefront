import type { Metadata } from "next";
import { SignInForm } from "@/components/forms/SignInForm";
import { PageIntro } from "@/components/layout/PageIntro/PageIntro";
import { CheckList } from "@/components/ui/CheckList/CheckList";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs/Breadcrumbs";
import styles from "../help/help.module.css";

export const metadata: Metadata = { title: "Sign in", robots: { index: false } };

/** SF-AUTH-01 · Sign in with mobile number + OTP. */
export default function SignInPage() {
  return (
    <>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Sign in" }]} />
      <div className={`container ${styles.page}`}>
        <div className={styles.split}>
          <div className={styles.prose}>
            <PageIntro
              overline="Your account"
              title="Sign in with your mobile"
              lead="One account for orders, artwork, invoices and quotations."
            />
            <CheckList
              items={[
                "Track every order stage",
                "Upload or replace artwork after checkout",
                "Download GST invoices",
                "Review and accept bulk quotations",
              ]}
            />
          </div>
          <SignInForm />
        </div>
      </div>
    </>
  );
}

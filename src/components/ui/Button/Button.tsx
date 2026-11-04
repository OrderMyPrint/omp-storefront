import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { cx } from "@/lib/cx";
import styles from "./Button.module.css";

export type ButtonVariant = "primary" | "accent" | "secondary" | "ghost" | "destructive";

type CommonProps = {
  variant?: ButtonVariant;
  icon?: LucideIcon;
  fullWidth?: boolean;
  className?: string;
  children: ReactNode;
};

type ButtonAsLink = CommonProps & { href: string } & Omit<
    ComponentPropsWithoutRef<typeof Link>,
    "href" | "className" | "children"
  >;
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    ComponentPropsWithoutRef<"button">,
    "className" | "children"
  >;

/** Figma "Button" (Variant × State). 44 px minimum height. */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", icon: Icon, fullWidth, className, children, ...rest } = props;
  const classes = cx(styles.button, styles[variant], fullWidth && styles.fullWidth, className);
  const content = (
    <>
      {Icon ? <Icon size={20} aria-hidden="true" /> : null}
      <span>{children}</span>
    </>
  );

  if ("href" in rest && rest.href !== undefined) {
    const { href, ...linkProps } = rest as ButtonAsLink;
    return (
      <Link href={href} className={classes} {...linkProps}>
        {content}
      </Link>
    );
  }

  const { type = "button", ...buttonProps } = rest as ButtonAsButton;
  return (
    <button type={type} className={classes} {...buttonProps}>
      {content}
    </button>
  );
}

"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { type AnalyticsEventType, toExternalHost } from "../schemas";
import { trackEvent } from "../track";

type TrackedLinkProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> &
  Pick<LinkProps, "href" | "prefetch"> & {
    /** Tipo do evento disparado no clique. */
    eventType: Exclude<AnalyticsEventType, "PAGE_VIEW">;
    /** Slug do alvo (roadmap, curso, projeto, carreira). */
    targetSlug?: string;
    children: ReactNode;
  };

/**
 * Link que dispara um evento de navegação ao ser clicado. Para links externos,
 * envia apenas o host de destino. Funciona normalmente sem analytics habilitado.
 */
export function TrackedLink({
  eventType,
  targetSlug,
  href,
  onClick,
  children,
  ...rest
}: TrackedLinkProps) {
  const pathname = usePathname();
  const hrefString = typeof href === "string" ? href : href.toString();
  const isExternal = /^https?:\/\//i.test(hrefString);

  const handleClick: AnchorHTMLAttributes<HTMLAnchorElement>["onClick"] = (event) => {
    trackEvent({
      type: eventType,
      path: pathname ?? "/",
      targetSlug,
      externalHost: isExternal ? toExternalHost(hrefString) : undefined,
    });
    onClick?.(event);
  };

  if (isExternal) {
    return (
      <a
        href={hrefString}
        onClick={handleClick}
        rel="noopener noreferrer"
        target="_blank"
        {...rest}
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} onClick={handleClick} {...rest}>
      {children}
    </Link>
  );
}

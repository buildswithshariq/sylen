"use client";

import Link, { LinkProps } from "next/link";
import { useRouter } from "next/navigation";
import { ReactNode, MouseEvent } from "react";

interface TransitionLinkProps extends LinkProps {
  children: ReactNode;
  className?: string;
  href: string;
}

export default function TransitionLink({
  children,
  href,
  className,
  onClick,
  ...props
}: TransitionLinkProps & {
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
}) {
  const router = useRouter();

  const handleTransition = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      onClick(e);
      if (e.defaultPrevented) return;
    }

    // Default to handling if it's internal and not open-in-new-tab
    if (href.startsWith("/") && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();

      if (!document.startViewTransition) {
        router.push(href);
        return;
      }

      document.startViewTransition(() => {
        router.push(href);
      });
    }
  };

  return (
    <Link
      href={href}
      onClick={handleTransition}
      className={className}
      {...props}
    >
      {children}
    </Link>
  );
}

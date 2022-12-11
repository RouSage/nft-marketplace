import Link, { LinkProps } from "next/link";
import { useRouter } from "next/router";
import React from "react";

type Props = {
  children: React.ReactNode;
  href: string;
  className: string;
  activeClassName: string;
} & LinkProps;

const ActiveLink = ({
  children,
  activeClassName,
  className,
  href,
  ...props
}: Props) => {
  const { pathname } = useRouter();

  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`${className} ${isActive ? activeClassName : ""}`}
      aria-current={isActive ? "page" : undefined}
      {...props}
    >
      {children}
    </Link>
  );
};

export default ActiveLink;

import { NavLink as RouterNavLink, type NavLinkProps } from "react-router-dom";
import { cn } from "@/lib/utils";

export default function NavLink({ className, ...props }: NavLinkProps) {
  return (
    <RouterNavLink
      className={({ isActive }) =>
        cn(
          "text-sm font-medium transition-colors hover:text-primary",
          isActive ? "text-primary" : "text-muted-foreground",
          typeof className === "function" ? className({ isActive, isPending: false, isTransitioning: false }) : className
        )
      }
      {...props}
    />
  );
}

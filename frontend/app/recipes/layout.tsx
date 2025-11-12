// app/recipes/layout.tsx
import React from "react";
import Link from "next/link";

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>{children}</>
  );
}

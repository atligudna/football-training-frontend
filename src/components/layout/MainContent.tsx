import { ReactNode } from "react";

interface MainContentProps {
  children: ReactNode;
}

export default function MainContent({
  children,
}: MainContentProps) {
  return (
    <main className="flex-1 p-8">
      {children}
    </main>
  );
}
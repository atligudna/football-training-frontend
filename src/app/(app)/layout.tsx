import AppShell from "@/components/layout/AppShell";
import { ProtectedRoute } from "@/features/auth/components/ProtectedRoute";

interface Props {
  children: React.ReactNode;
}

export default function AppLayout({ children }: Props) {
  return (
    <ProtectedRoute>
      <AppShell>
        {children}
      </AppShell>
    </ProtectedRoute>
  );
}
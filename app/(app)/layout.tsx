import { AppShell } from "@/components/layout/app-shell";
import { AppLock } from "@/components/auth/app-lock";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppLock>
      <AppShell>{children}</AppShell>
    </AppLock>
  );
}



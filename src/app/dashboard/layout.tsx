import { MobileShell } from '@/components/MobileShell';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

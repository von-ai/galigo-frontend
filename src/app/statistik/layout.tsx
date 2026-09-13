import { MobileShell } from '@/components/MobileShell';

export default function StatistikLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

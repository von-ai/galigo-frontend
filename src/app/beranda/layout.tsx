import { MobileShell } from '@/components/MobileShell';

export default function BerandaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

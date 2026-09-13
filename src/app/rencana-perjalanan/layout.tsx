import { MobileShell } from '@/components/MobileShell';

export default function RencanaPerjalananLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

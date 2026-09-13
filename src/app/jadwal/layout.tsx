import { MobileShell } from '@/components/MobileShell';

export default function JadwalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

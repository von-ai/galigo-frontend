import { MobileShell } from '@/components/MobileShell';

export default function KomunitasLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

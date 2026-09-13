import { MobileShell } from '@/components/MobileShell';

export default function PilihRuteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

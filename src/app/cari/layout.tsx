import { MobileShell } from '@/components/MobileShell';

export default function CariLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

import { MobileShell } from '@/components/MobileShell';

export default function ProfilLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

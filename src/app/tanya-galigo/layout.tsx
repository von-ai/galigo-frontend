import { MobileShell } from '@/components/MobileShell';

export default function TanyaGaligoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MobileShell>{children}</MobileShell>;
}

import Link from "next/link";
import { PackageCheck } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <>
      <header>
        <Link href="/" className="brand">
          <span className="brand-mark">
            <PackageCheck size={23} />
          </span>
          <span>
            Liverpool <b>Pedidos</b>
          </span>
        </Link>
        <div className="environment">OPERACIÓN DIGITAL</div>
      </header>
      <main>{children}</main>
      <footer>El Puerto de Liverpool · Gestión omnicanal de pedidos</footer>
    </>
  );
}
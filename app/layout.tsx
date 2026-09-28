import './globals.css'
import type { Metadata } from "next";
import Layout from "./components/Layout";

export const metadata: Metadata = {
  title: "Liverpool Pedidos",
  description: "Gestión omnicanal de pedidos de El Puerto de Liverpool",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es-MX">
      <body suppressHydrationWarning>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
}

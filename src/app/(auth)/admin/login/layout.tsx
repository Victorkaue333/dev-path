import type { Metadata } from "next";

import { adminMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...adminMetadata,
  title: "Entrar no painel",
};

/** Layout mínimo da tela de login: fora da casca do painel, nunca indexado. */
export default function LoginLayout({ children }: LayoutProps<"/admin/login">) {
  return <div className="flex min-h-screen flex-col bg-dp-ink">{children}</div>;
}

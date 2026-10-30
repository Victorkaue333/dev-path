import { redirect } from "next/navigation";

/** /admin não tem conteúdo próprio: vai para a visão geral. */
export default function AdminIndexPage() {
  redirect("/admin/dashboard");
}

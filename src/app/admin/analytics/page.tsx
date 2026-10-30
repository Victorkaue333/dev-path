import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { PlannedSection } from "@/features/admin/components/planned-section";

export default function AdminAnalyticsPage() {
  return (
    <>
      <AdminPageHeader
        title="Analytics"
        description="Métricas agregadas de navegação, sem dados pessoais. Nenhum número é exibido até existir agregação real."
        status="planejado"
      />
      <PlannedSection
        feature="Painel de métricas"
        reference="docs/INTEGRATION.md (Analytics e LGPD)"
      />
    </>
  );
}

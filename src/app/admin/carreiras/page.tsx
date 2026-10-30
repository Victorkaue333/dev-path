import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { PlannedSection } from "@/features/admin/components/planned-section";

export default function AdminCareersPage() {
  return (
    <>
      <AdminPageHeader
        title="Carreiras"
        description="Criar, editar, publicar e arquivar carreiras."
        status="planejado"
      />
      <PlannedSection feature="Gestão de carreiras" reference="docs/milestones/MILESTONES.md" />
    </>
  );
}

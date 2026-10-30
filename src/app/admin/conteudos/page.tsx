import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { PlannedSection } from "@/features/admin/components/planned-section";

export default function AdminEditorialPage() {
  return (
    <>
      <AdminPageHeader
        title="Conteúdos"
        description="Artigos, guias, páginas institucionais e figuras históricas."
        status="planejado"
      />
      <PlannedSection
        feature="Gestão de conteúdo editorial"
        reference="docs/milestones/MILESTONES.md"
      />
    </>
  );
}

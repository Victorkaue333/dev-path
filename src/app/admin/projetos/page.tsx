import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { PlannedSection } from "@/features/admin/components/planned-section";

export default function AdminProjectsPage() {
  return (
    <>
      <AdminPageHeader
        title="Projetos"
        description="Projetos práticos por nível e critérios de conclusão."
        status="planejado"
      />
      <PlannedSection feature="Gestão de projetos" reference="docs/milestones/MILESTONES.md" />
    </>
  );
}

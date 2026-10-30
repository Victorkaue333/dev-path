import { AdminPageHeader } from "@/features/admin/components/admin-page-header";
import { PlannedSection } from "@/features/admin/components/planned-section";

export default function AdminCoursesPage() {
  return (
    <>
      <AdminPageHeader
        title="Cursos"
        description="Curadoria de cursos gratuitos e documentação oficial."
        status="planejado"
      />
      <PlannedSection feature="Gestão de cursos" reference="docs/milestones/MILESTONES.md" />
    </>
  );
}

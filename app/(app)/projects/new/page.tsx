// app/(app)/projects/new/page.tsx  (no "use client")
import NotFoundState from "@/components/states/notFound";
import { getModule } from "@/modules/registry";
import type { ModuleKey } from "@/modules/types/types";
import { getBrand } from "@/modules/brands";
import { getCompanyModules } from "@/services/moduleService";
import NewProjectWizard from "@/modules/components/projects/newProjectWizard";

export default async function NewProjectPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const [{ module: param }, brand, companyModules] = await Promise.all([
    searchParams,
    getBrand(),
    getCompanyModules(),
  ]);

  // a locked domain wins over the URL
  const module = (brand.module ?? param) as ModuleKey | undefined;

  if (!module || !companyModules.includes(module) || !getModule(module)) {
    return <NotFoundState title="Module niet beschikbaar" />;
  }

  return <NewProjectWizard module={module} />;
}

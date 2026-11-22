// app/(app)/settings/cleaning-methods/page.tsx  (server)
import NotFoundState from "@/components/states/notFound";
import { getBrand } from "@/modules/brands";
import type { ModuleKey } from "@/modules/types/types";
import { getCompanyModules } from "@/services/moduleService";
import { getModule } from "@/modules/registry";
import ModuleTabs from "@/components/navigation/moduleTabs";
import CleaningMethodsView from "@/components/lists/cleaningMethods/cleaningMethodsView";

export default async function CleaningMethodSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ module?: string }>;
}) {
  const [{ module: param }, brand, companyModules] = await Promise.all([
    searchParams,
    getBrand(),
    getCompanyModules(),
  ]);

  // which modules may be shown here
  const available = (brand.module ? [brand.module] : companyModules).filter(
    (m) => companyModules.includes(m) && getModule(m),
  );

  if (available.length === 0) {
    return <NotFoundState title="Geen modules beschikbaar" />;
  }

  // locked → that one; otherwise the URL, if valid; otherwise the first one
  const module: ModuleKey =
    brand.module ?? (available.includes(param as ModuleKey) ? (param as ModuleKey) : available[0]);

  return (
    <div className="flex flex-col gap-6">
      {/* header … */}
      {available.length > 1 && <ModuleTabs modules={available} current={module} />}
    </div>
  );
}

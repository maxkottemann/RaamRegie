import { ModuleProvider } from "@/context/moduleContext";
import { getBrand } from "@/modules/brands";
import { getCompanyModules } from "@/services/moduleService";
import AppClientShell from "./_components/appClientShell";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [brand, companyModules] = await Promise.all([getBrand(), getCompanyModules()]);

  return (
    <ModuleProvider lockedModule={brand.module} companyModules={companyModules}>
      <AppClientShell brand={brand}>{children}</AppClientShell>
    </ModuleProvider>
  );
}

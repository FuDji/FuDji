import { getCompanyContext } from "@/app/company/data";
import { PageHeader } from "@/components/layout/page-header";
import { CompanySettingsForm } from "@/components/company/settings-form";

export default async function CompanySettingsPage() {
  const { company } = await getCompanyContext();

  return (
    <div>
      <PageHeader title="Podešavanja" description="Način plaćanja, budžeti, rok za naručivanje i dostava." />
      <CompanySettingsForm company={company} />
    </div>
  );
}

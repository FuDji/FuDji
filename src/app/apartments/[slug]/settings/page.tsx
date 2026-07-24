import { notFound } from "next/navigation";

import { requireUser } from "@/lib/auth";
import { getOwnedApartment, listEmergencyContacts, listGalleryImages, getNotificationPreferences } from "@/lib/data/apartments";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApartmentForm } from "@/components/apartments/apartment-form";
import { BrandingForm } from "@/components/settings/branding-form";
import { NotificationForm } from "@/components/settings/notification-form";
import { ContactsManager } from "@/components/settings/contacts-manager";
import { GalleryManager } from "@/components/settings/gallery-manager";
import { DangerZone } from "@/components/settings/danger-zone";
import { updateApartment } from "@/app/apartments/actions";

export default async function ApartmentSettingsPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { supabase, user } = await requireUser();
  const apartment = await getOwnedApartment(supabase, slug, user.id);
  if (!apartment) notFound();

  const [contacts, gallery, prefs] = await Promise.all([
    listEmergencyContacts(supabase, apartment.id),
    listGalleryImages(supabase, apartment.id),
    getNotificationPreferences(supabase, apartment.id),
  ]);

  const boundUpdate = updateApartment.bind(null, apartment.id);

  return (
    <div>
      <PageHeader title="Podešavanja" description="Podesi sve što se tiče ovog apartmana." />

      <Tabs defaultValue="general">
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="general">Opšte</TabsTrigger>
          <TabsTrigger value="branding">Brendiranje</TabsTrigger>
          <TabsTrigger value="contacts">Kontakti</TabsTrigger>
          <TabsTrigger value="gallery">Galerija</TabsTrigger>
          <TabsTrigger value="notifications">Obaveštenja</TabsTrigger>
          <TabsTrigger value="danger">Opasna zona</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <div className="max-w-3xl">
            <ApartmentForm action={boundUpdate} defaultValues={apartment} submitLabel="Sačuvaj izmene" />
          </div>
        </TabsContent>
        <TabsContent value="branding">
          <div className="max-w-2xl">
            <BrandingForm apartment={apartment} />
          </div>
        </TabsContent>
        <TabsContent value="contacts">
          <div className="max-w-2xl">
            <ContactsManager apartmentId={apartment.id} contacts={contacts} />
          </div>
        </TabsContent>
        <TabsContent value="gallery">
          <div className="max-w-2xl">
            <GalleryManager apartmentId={apartment.id} images={gallery} />
          </div>
        </TabsContent>
        <TabsContent value="notifications">
          <div className="max-w-2xl">
            <NotificationForm apartmentId={apartment.id} slug={slug} prefs={prefs} />
          </div>
        </TabsContent>
        <TabsContent value="danger">
          <div className="max-w-2xl">
            <DangerZone apartmentId={apartment.id} apartmentName={apartment.name} />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

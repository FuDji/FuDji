"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/layout/empty-state";
import { ItemDialog } from "@/components/inventory/item-dialog";
import { ItemCard } from "@/components/inventory/item-card";
import { DynamicIcon } from "@/lib/icon-map";
import { INVENTORY_CATEGORIES } from "@/lib/constants";
import { Package } from "lucide-react";
import type { InventoryItem } from "@/types";

export function InventoryTabs({
  apartmentId,
  slug,
  items,
}: {
  apartmentId: string;
  slug: string;
  items: InventoryItem[];
}) {
  return (
    <Tabs defaultValue="all">
      <TabsList className="flex-wrap h-auto">
        <TabsTrigger value="all">All ({items.length})</TabsTrigger>
        {INVENTORY_CATEGORIES.map((cat) => {
          const count = items.filter((i) => i.category === cat.value).length;
          return (
            <TabsTrigger key={cat.value} value={cat.value}>
              <DynamicIcon name={cat.icon} className="size-3.5" /> {cat.label} ({count})
            </TabsTrigger>
          );
        })}
      </TabsList>

      <TabsContent value="all">
        <ItemGrid apartmentId={apartmentId} slug={slug} items={items} />
      </TabsContent>
      {INVENTORY_CATEGORIES.map((cat) => (
        <TabsContent key={cat.value} value={cat.value}>
          <ItemGrid
            apartmentId={apartmentId}
            slug={slug}
            items={items.filter((i) => i.category === cat.value)}
            defaultCategory={cat.value}
          />
        </TabsContent>
      ))}
    </Tabs>
  );
}

function ItemGrid({
  apartmentId,
  slug,
  items,
  defaultCategory,
}: {
  apartmentId: string;
  slug: string;
  items: InventoryItem[];
  defaultCategory?: string;
}) {
  if (items.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No items here yet"
        description="Track plates, towels, appliances and supplies so cleaners and guests always know what's where."
        action={<ItemDialog apartmentId={apartmentId} slug={slug} defaultCategory={defaultCategory} />}
      />
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <ItemCard key={item.id} apartmentId={apartmentId} slug={slug} item={item} />
      ))}
    </div>
  );
}

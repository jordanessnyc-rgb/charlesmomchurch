import Link from "next/link";
import { notFound } from "next/navigation";
import { getItem, isCollectionName } from "@/lib/content";
import { deleteItemAction, saveItemAction } from "@/lib/admin/actions";
import { collectionSchemas } from "@/lib/admin/schemas";
import { ItemForm } from "@/components/admin/item-form";

export default async function EditItemPage({ params }: { params: Promise<{ collection: string; id: string }> }) {
  const { collection, id } = await params;
  if (!isCollectionName(collection)) notFound();
  const def = collectionSchemas[collection];
  const isNew = id === "new";
  const item = isNew ? null : await getItem(collection, id);
  if (!isNew && !item) notFound();
  const initial = (item ?? { published: true, sort: 0 }) as Record<string, unknown>;
  return (
    <div className="max-w-4xl space-y-5">
      <Link href={`/admin/content/${collection}`} className="text-sm text-navy-800 underline">← {def.label}</Link>
      <h1 className="text-2xl font-semibold text-navy-800">{isNew ? `New ${def.singular.toLowerCase()}` : `Edit ${def.singular.toLowerCase()}`}</h1>
      <div className="rounded-2xl border border-line bg-white p-6 shadow-card">
        <ItemForm
          key={id}
          fields={def.fields}
          initial={initial}
          showPublish
          onSave={saveItemAction.bind(null, collection, isNew ? null : id)}
          onDelete={isNew ? undefined : deleteItemAction.bind(null, collection, id)}
          uploadsEnabled={!!process.env.BLOB_READ_WRITE_TOKEN}
        />
      </div>
    </div>
  );
}

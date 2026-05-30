import { notFound } from "next/navigation";
import { CollectionExperience } from "@/components/collection-experience";
import { getCollectionByHandle, getCollections } from "@/lib/products";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { handle } = await params;
  const collection = await getCollectionByHandle(handle);

  if (!collection) {
    return { title: "Collection not found | Nord Threads" };
  }

  return {
    title: `${collection.name} | Nord Threads`,
    description: collection.shortStory
  };
}

export default async function CollectionDetailPage({ params }) {
  const { handle } = await params;
  const [collection, collections] = await Promise.all([
    getCollectionByHandle(handle),
    getCollections()
  ]);

  if (!collection) {
    notFound();
  }

  return <CollectionExperience collection={collection} collections={collections} />;
}

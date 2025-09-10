import { ItemDetail } from "@/components/item-detail"
import { supabase } from "@/lib/supabaseClient"
import { MarketplaceHeader } from "@/components/marketplace-header"

type ItemPageProps = { params: Promise<{ id: string }> };

export default async function ItemPage({ params }: ItemPageProps) {
    const { id } = await params;
  const { data: item, error } = await supabase
    .from("items")
    .select("*")
    .eq("id", id)
    .single()

  if (error || !item) {
    return <div className="p-6 text-red-500">Item not found.</div>
  }

  return (
    <>
      <MarketplaceHeader />
      <ItemDetail item={item} />
    </>
)
}

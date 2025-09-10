import { MarketplaceHeader } from "@/components/marketplace-header"
import { MarketplaceSidebar } from "@/components/marketplace-sidebar"
import { CategoryContent } from "@/components/category-content"

export default function CategoryPage({ params }: { params : { slug: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <div className="flex">
        <MarketplaceSidebar />
        <CategoryContent slug={params.slug} />
      </div>
    </div>
  )
}

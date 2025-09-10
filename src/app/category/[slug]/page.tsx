import { MarketplaceHeader } from "@/components/marketplace-header"
import { MarketplaceSidebar } from "@/components/marketplace-sidebar"
import { CategoryContent } from "@/components/category-content"
interface PageProps {
  params: Promise<{ slug: string }>
}

export default function CategoryPage({ params }: CategoryPageProps) {
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

import { MarketplaceHeader } from "@/components/marketplace-header"
import { MarketplaceSidebar } from "@/components/marketplace-sidebar"
import { CategoryContent } from "@/components/category-content"

interface CategoryPageProps {
  params: {
    slug: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default function CategoryPage({
  params,
  searchParams,
}: CategoryPageProps) {
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
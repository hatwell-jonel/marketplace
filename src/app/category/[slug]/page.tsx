import { MarketplaceHeader } from "@/components/marketplace-header"
import { MarketplaceSidebar } from "@/components/marketplace-sidebar"
import { CategoryContent } from "@/components/category-content"

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({
  params,
}: CategoryPageProps) {
  const { slug } = await params;
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <div className="flex">
        <MarketplaceSidebar />
        <CategoryContent slug={slug} />
      </div>
    </div>
  )
}
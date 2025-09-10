import { CreateListingForm } from "@/components/create-listing-form"
import { MarketplaceHeader } from "@/components/marketplace-header"
import { MarketplaceSidebar } from "@/components/marketplace-sidebar"

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <div className="flex">
        <MarketplaceSidebar />
        <main className="flex-1 p-6">
          <CreateListingForm />
        </main>
      </div>
    </div>
  )
}

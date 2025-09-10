import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

const todaysPicksListings = [
  {
    id: 1,
    title: "Orange Bike for sale",
    price: 120,
    image: "/orange-bike-for-sale.jpg",
    location: "Palo Alto, CA",
    timePosted: "just now",
  },
  {
    id: 2,
    title: "iPhone 14 Pro Max",
    price: 899,
    image: "/iphone-14-pro-max.png",
    location: "San Francisco, CA",
    timePosted: "2 hours ago",
  },
  {
    id: 3,
    title: "Gaming Laptop RTX 4070",
    price: 1299,
    image: "/gaming-laptop.png",
    location: "Mountain View, CA",
    timePosted: "3 hours ago",
  },
  {
    id: 4,
    title: "AirPods Pro 2nd Gen",
    price: 199,
    image: "/airpods-pro-lifestyle.png",
    location: "Cupertino, CA",
    timePosted: "5 hours ago",
  },
]

export function MarketplaceContent() {
  return (
    <main className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-foreground mb-6">Today's picks</h1>

        {/* Search bar */}
        <div className="flex gap-3 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input placeholder="Search listings..." className="pl-10 bg-card border-input" />
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 px-6">Search</Button>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {todaysPicksListings.map((listing) => (
            <Card key={listing.id} className="bg-card border-border hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Image src={listing.image || "/placeholder.svg"} alt={listing.title} fill className="object-cover" />
                </div>
                <div className="p-4">
                  <div className="text-xl font-bold text-foreground mb-1">${listing.price.toLocaleString()}</div>
                  <h3 className="font-medium text-foreground mb-2 line-clamp-2">{listing.title}</h3>
                  <div className="text-sm text-muted-foreground">
                    <div>{listing.timePosted}</div>
                    <div>{listing.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </main>
  )
}

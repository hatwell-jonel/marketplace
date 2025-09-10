"use client"

import { Tag, List, HelpCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { categories } from "@/lib/categories"

export function MarketplaceSidebar() {
  const pathname = usePathname()

  const isActiveCategory = (slug: string) => {
    return pathname === `/category/${slug}`
  }

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border p-4 h-[calc(100vh-64px)] overflow-y-auto">
      {/* Create new listing section */}
      <div className="mb-6">
        <h2 className="font-semibold text-sidebar-foreground mb-3">Create new listing</h2>
        <div className="space-y-2">
          <Link href="/create">
            <Button
              variant="ghost"
              className={`w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground cursor-pointer ${
                pathname === "/create"
                  ? "bg-sidebar-primary text-white"
                  : ""
              }`}>
              <Tag className="h-4 w-4 mr-3" />
              Create Item
            </Button>
          </Link>
        </div>
      </div>

      {/* Categories section */}
      <div>
        <h2 className="font-semibold text-sidebar-foreground mb-3">Categories</h2>
        <div className="space-y-1">
          {categories.map((category) => (
            <Link key={category.slug} href={`/category/${category.slug}`}>
              <Button
                variant="ghost"
                className={`w-full justify-start text-sm cursor-pointer ${
                  isActiveCategory(category.slug)
                    ? "bg-sidebar-primary text-white"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                }`}
              >
                {category.name}
              </Button>
            </Link>
          ))}
        </div>
      </div>
    </aside>
  )
}
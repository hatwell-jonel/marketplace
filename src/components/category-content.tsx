"use client"

import { useState, useEffect } from "react"
import { categories } from "@/lib/categories"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Mail, Calendar } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import Link from "next/link"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import Image from "next/image"

interface Item {
  id: number
  title: string
  category: string
  price: number
  location: string | null
  contact_email: string
  description: string | null
  image: string | null
  created_at: string
}

interface CategoryContentProps {
  slug: string
}

export function CategoryContent({ slug }: CategoryContentProps) {
  const [items, setItems] = useState<Item[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  // Get category info from slug
  const category = categories.find(cat => cat.slug === slug)
  const categoryName = category?.name

  useEffect(() => {
    if (categoryName) {
      fetchCategoryItems(categoryName)
    }
  }, [categoryName])

  const fetchCategoryItems = async (categoryName: string) => {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('items')
        .select('*')
        .eq('category', categoryName)
        .order('created_at', { ascending: false })

      if (error) {
        throw error
      }

      setItems(data || [])
    } catch (err) {
      console.error('Error fetching items:', err)
      setError('Failed to load items')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      return 'Just now'
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      if (diffInDays < 7) {
        return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`
      } else {
        return date.toLocaleDateString()
      }
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price)
  }

  const filteredItems = items.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.location?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (!category) {
    return (
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-foreground mb-2">Category Not Found</h1>
            <p className="text-muted-foreground">The category &quot;{slug}&quot; doesn&apos;t exist.</p>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex-1 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-1">{categoryName}</h1>
              <p className="text-muted-foreground">
                {isLoading ? 'Loading...' : `${items.length} item${items.length !== 1 ? 's' : ''} available`}
              </p>
            </div>
            <Badge variant="secondary" className="px-3 py-1">
              {categoryName}
            </Badge>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Content */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4"></div>
                    <div className="h-4 bg-muted rounded w-1/2"></div>
                    <div className="h-3 bg-muted rounded w-full"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">Error Loading Items</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <button
              onClick={() => categoryName && fetchCategoryItems(categoryName)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
            >
              Try Again
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-foreground mb-2">No Items Found</h2>
            <p className="text-muted-foreground mb-4">
              There are no items listed in the {categoryName} category yet.
            </p>
            <p className="text-sm text-muted-foreground">
              Be the first to list an item in this category!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <Link href={`/item/${item.id}`} key={item.id}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                  {/* Item Image */}
                  <div className="aspect-video bg-muted overflow-hidden">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground bg-muted">
                        No Image
                      </div>
                    )}
                  </div>


                  {/* Item Details */}
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div>
                        <h3 className="font-semibold text-lg leading-tight mb-1 line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-2xl font-bold text-primary">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                      {item.description && (
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {item.description}
                        </p>
                      )}
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        {item.location && (
                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span>{item.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(item.created_at)}</span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-border">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Mail className="h-3 w-3" />
                          <span className="truncate">{item.contact_email}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
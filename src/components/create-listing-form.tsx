"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import { categories } from "@/lib/categories"
import { useRouter } from 'next/navigation'
import { supabase } from "@/lib/supabaseClient"

export function CreateListingForm() {
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    price: "",
    location: "",
    email: "",
    description: "",
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFileSelect = (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const isValidType = file.type.startsWith("image/")
    const isValidSize = file.size <= 5 * 1024 * 1024 // 5MB

    if (isValidType && isValidSize) {
      setPhoto(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhoto(null)
    setPhotoPreview("")
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    handleFileSelect(e.dataTransfer.files)
  }

  // Get selected category name for display
  const getSelectedCategoryName = () => {
    const selectedCategory = categories.find(cat => cat.slug === formData.category)
    return selectedCategory?.name || ""
  }

  // Upload image to Supabase storage
  const uploadImage = async (file: File): Promise<string | null> => {
    try {
      const fileName = `${Date.now()}-${file.name}`
      const { data, error } = await supabase.storage
        .from('posts-images') // Make sure this bucket exists
        .upload(fileName, file)

      if (error) {
        console.error('Image upload error:', error)
        return null
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('posts-images')
        .getPublicUrl(fileName)

      return publicUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      return null
    }
  }

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.title || !formData.category || !formData.price || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    setIsSubmitting(true)

    try {
      // Upload image if present
      let imageUrl = null
      if (photo) {
        imageUrl = await uploadImage(photo)
      }

      // Get category name for foreign key constraint
      const selectedCategory = categories.find(cat => cat.slug === formData.category)
      const categoryName = selectedCategory?.name

      if (!categoryName) {
        throw new Error('Invalid category selected')
      }

      // Insert into database
      const { data, error } = await supabase
        .from('items')
        .insert({
          title: formData.title,
          category: categoryName, // Using category name for foreign key
          price: parseFloat(formData.price),
          location: formData.location || null,
          contact_email: formData.email,
          description: formData.description || null,
          image: imageUrl
        })
        .select()

      if (error) {
        throw error
      }

      console.log('Item created successfully:', data)
      
      // Reset form
      setFormData({
        title: "",
        category: "",
        price: "",
        location: "",
        email: "",
        description: "",
      })
      setPhoto(null)
      setPhotoPreview("")
      
      // Show success message or redirect
      alert('Listing created successfully!')
      // Optional: redirect to the listing or marketplace
      // router.push('/marketplace')

    } catch (error) {
      console.error('Error creating listing:', error)
      alert('Error creating listing. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-lg">F</span>
        </div>
        <h1 className="text-2xl font-semibold text-foreground">Marketplace</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            {/* Photos Upload */}
            <div>
              <Label htmlFor="photos" className="text-sm font-medium text-foreground mb-2 block">
                Photos
              </Label>
              <div
                className="border-2 border-dashed border-muted-foreground/30 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground font-medium">Add photos</p>
                <p className="text-xs text-muted-foreground mt-1">JPEG, PNG, or WebP (max 5MB)</p>
                <p className="text-xs text-muted-foreground">Click to browse or drag and drop</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
              {photo && photoPreview && (
                <div className="mt-4">
                  <div className="relative inline-block">
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Preview"
                      className="w-32 h-24 object-cover rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Title */}
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-foreground mb-2 block">
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                placeholder="What are you selling?"
                value={formData.title}
                onChange={(e) => handleInputChange("title", e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Category */}
            <div>
              <Label htmlFor="category" className="text-sm font-medium text-foreground mb-2 block">
                Category <span className="text-destructive">*</span>
              </Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)} required>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.slug} value={category.slug}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Price */}
            <div>
              <Label htmlFor="price" className="text-sm font-medium text-foreground mb-2 block">
                Price <span className="text-destructive">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={formData.price}
                onChange={(e) => handleInputChange("price", e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-sm font-medium text-foreground mb-2 block">
                Location
              </Label>
              <Input
                id="location"
                placeholder="City, State"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className="w-full"
              />
            </div>

            {/* Contact Email */}
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-foreground mb-2 block">
                Contact Email <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="w-full"
                required
              />
            </div>

            {/* Description */}
            <div>
              <Label htmlFor="description" className="text-sm font-medium text-foreground mb-2 block">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Describe your item..."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                className="w-full min-h-[120px] resize-none"
              />
            </div>

            {/* Create Listing Button */}
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium py-3"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Listing...
                </>
              ) : (
                'Create Listing'
              )}
            </Button>
          </div>

          {/* Preview Section */}
          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="aspect-video bg-muted rounded-lg border-2 border-dashed border-muted-foreground/30 overflow-hidden">
                  {photoPreview ? (
                    <img
                      src={photoPreview || "/placeholder.svg"}
                      alt="Main preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                      No photos uploaded
                    </div>
                  )}
                </div>
                <div className="bg-card border rounded-lg p-4 space-y-3">
                  <h3 className="font-semibold text-lg">{formData.title || "Title"}</h3>
                  <p className="text-xl font-bold text-foreground">{formData.price ? `$${formData.price}` : "Price"}</p>
                  <div className="text-sm text-muted-foreground">
                    {getSelectedCategoryName() && (
                      <p className="mb-1">Category: {getSelectedCategoryName()}</p>
                    )}
                    <p>
                      Listed just now
                      {formData.location && <><br />in {formData.location}</>}
                    </p>
                  </div>
                  <div className="pt-2 border-t">
                    <h4 className="font-medium text-sm mb-1">Seller Information</h4>
                    <p className="text-sm text-muted-foreground">{formData.email || "seller@email.com"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}
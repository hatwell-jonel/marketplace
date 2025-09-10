"use client"

import { useState } from "react"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "./ui/badge"
import { useRouter } from "next/navigation"
import { sendEmail } from "@/app/sendEmail"
import Image from "next/image"

interface Item {
  id: number
  image: string
  title: string | null
  category: string | null
  price: number | null
  location: string | null
  contact_email: string | null
  description: string | null
  created_at: string
}

interface ItemDetailProps {
  item: Item
}

export function ItemDetail({ item }: ItemDetailProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("I'm interested in your item!")
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setSuccess(false)

    try {
      await sendEmail({
        fromEmail: email,
        toEmail: item.contact_email!,
        message: message,
        itemId: item.id
      })
      setEmail("")
      setMessage("I'm interested in your item!")
      setSuccess(true)
    } catch (error) {
      console.error('Error sending message:', error)
      setSuccess(false)
    } finally {
      setSending(false)
    }
  }


  return (
    <div className="min-h-screen bg-background">
      {/* Back button */}
      <div className="max-w-6xl mx-auto p-4">
        <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#1877f2] hover:underline mb-4 cursor-pointer"
        >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
        </button>
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left side - Image */}
          <div className="space-y-4">
            <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-100">
              <Image
                src={item.image} 
                alt={item.title || "Item image"}
                className="object-cover"
              />
            </div>
          </div>

          {/* Right side - Details and Contact */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{item.title}</h1>
              <p className="text-3xl font-bold text-foreground mb-4">${item.price}</p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>Listed {new Date(item.created_at).toLocaleString()}</span>
                <span>in {item.location}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4 gap-2">Category: <Badge>{item.category}</Badge> </p>
            </div>

            {/* Description */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Description</h3>
              <p className="text-foreground break-words">{item.description}</p>
            </div>

            {/* Seller Information */}
            <div>
              <h3 className="font-semibold text-lg mb-2">Seller Information</h3>
              <p className="text-muted-foreground">{item.contact_email}</p>
            </div>

            {/* Message Seller Form */}
            <Card>
                <CardContent className="p-6">
                <h3 className="font-semibold text-lg mb-4">Message Seller</h3>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Your Email</label>
                    <Input
                        type="email"
                        placeholder="your@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    </div>

                    <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Message</label>
                    <Textarea
                        placeholder="I'm interested in your item!"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={4}
                        required
                    />
                    </div>

                 <Button 
    type="submit" 
    className="w-full bg-[#1877f2] hover:bg-[#166fe5] text-white"
    disabled={sending}
  >
    {sending ? 'Sending...' : 'Send Message'}
  </Button>
  {success && (
    <div className="mt-4 p-4 bg-green-100 text-green-700 rounded-md text-center">
      Message sent successfully!
    </div>
  )}
                </form>
                </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

'use server'

import { supabase } from "@/lib/supabaseClient"

export async function sendEmail(data: {
  fromEmail: string,
  toEmail: string,
  message: string,
  itemId: number
}) {
  const { error } = await supabase
    .from('emails')
    .insert({
      from_email: data.fromEmail,
      to_email: data.toEmail,
      message: data.message,
      item_id: data.itemId
    })

  if (error) {
    throw new Error('Failed to send message')
  }

  return { success: true }
}
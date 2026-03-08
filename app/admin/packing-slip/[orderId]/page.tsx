"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { supabase } from "@/lib/supabase/client"

export default function PackingSlip() {
  const params = useParams()
  const orderId = params.orderId as string

  useEffect(() => {
    window.print()
  }, [])

  return (
    <div style={{ padding: "40px", fontFamily: "Arial", color: "black", background: "white" }}>
      <h1>Packing Slip</h1>

      <p><strong>Order ID:</strong> {orderId}</p>

      <p><strong>Brand:</strong> CoZeo</p>
      <p><strong>Tagline:</strong> Where Comfort Meets Class</p>

      <hr />

      <p>Customer details and product details will appear here.</p>

      <p style={{ marginTop: "40px" }}>
        Thank you for shopping with CoZeo.
      </p>
    </div>
  )
}
import type { Env } from "../types"
import {
  sendSlackMessage,
  createKYBNotificationMessage,
} from "../../utils/slack"

interface BusinessAddress {
  address1: string
  address2?: string
  city: string
  state: string
  country: string
  zip5: string
}

interface BusinessContact {
  type: "email" | "phone" | "website"
  value: string
}

interface MerchantKYBRequest {
  legal_name: string
  business_name?: string
  entity_type: string
  tax_id: string
  tax_id_type: "tin" | "ein" | "ssn"
  account_holder_name: string
  incorporation_date: string
  addresses: BusinessAddress[]
  contacts: BusinessContact[]
}

interface MerchantKYBResponse {
  id: string
  status: string
  createdAt: string
}

export async function onRequestPost(
  request: Request,
  env: Env
): Promise<Response> {
  try {
    // Parse the request body
    const kybData: MerchantKYBRequest = await request.json()

    // Validate required fields
    if (
      !kybData.legal_name ||
      !kybData.entity_type ||
      !kybData.tax_id ||
      !kybData.account_holder_name ||
      !kybData.incorporation_date ||
      !kybData.addresses ||
      kybData.addresses.length === 0 ||
      !kybData.contacts ||
      kybData.contacts.length === 0
    ) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields",
          message: "All required fields must be provided",
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Generate a unique ID for the KYB record
    const kybId = crypto.randomUUID()
    const createdAt = new Date().toISOString()

    // Extract the first address and contact (as per the form structure)
    const address = kybData.addresses[0]
    const contact = kybData.contacts[0]

    // Insert into D1 database
    const stmt = env.MERCHANTS_OAUTH.prepare(`
      INSERT INTO merchant_kyb (
        id,
        legal_name,
        business_name,
        entity_type,
        tax_id,
        tax_id_type,
        account_holder_name,
        incorporation_date,
        address1,
        address2,
        city,
        state,
        country,
        zip5,
        contact_type,
        contact_value,
        status,
        created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = await stmt
      .bind(
        kybId,
        kybData.legal_name,
        kybData.business_name || null,
        kybData.entity_type,
        kybData.tax_id,
        kybData.tax_id_type,
        kybData.account_holder_name,
        kybData.incorporation_date,
        address.address1,
        address.address2 || null,
        address.city,
        address.state,
        address.country,
        address.zip5,
        contact.type,
        contact.value,
        "pending", // Initial status
        createdAt
      )
      .run()

    if (!result.success) {
      console.error("Database error:", result.error)
      return new Response(
        JSON.stringify({
          error: "Database error",
          message: "Failed to save KYB information",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Return success response
    const response: MerchantKYBResponse = {
      id: kybId,
      status: "pending",
      createdAt: createdAt,
    }

    // Send Slack notification (non-blocking)
    if (env.SLACK_WEBHOOK_URL) {
      const slackMessage = createKYBNotificationMessage({
        id: kybId,
        legal_name: kybData.legal_name,
        business_name: kybData.business_name,
        entity_type: kybData.entity_type,
        status: "pending",
        createdAt: createdAt,
      })

      // Send notification asynchronously (don't wait for it)
      sendSlackMessage(env.SLACK_WEBHOOK_URL, slackMessage).catch((error) => {
        console.error("Failed to send Slack notification:", error)
      })
    } else {
      console.error("No Slack webhook URL provided")
    }

    return new Response(JSON.stringify(response), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("KYB submission error:", error)
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        message: "Failed to process KYB submission",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}

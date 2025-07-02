interface SlackBlock {
  type: string
  text?: {
    type: string
    text: string
    emoji?: boolean
  }
  fields?: Array<{
    type: string
    text: string
  }>
  elements?: Array<{
    type: string
    text: {
      type: string
      text: string
      emoji?: boolean
    }
    style?: string
    url?: string
  }>
}

interface SlackMessage {
  text?: string
  blocks?: SlackBlock[]
  attachments?: SlackBlock[]
}

export async function sendSlackMessage(
  webhookUrl: string,
  message: SlackMessage
): Promise<boolean> {
  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    })

    if (!response.ok) {
      console.error(
        "Slack webhook error:",
        response.status,
        response.statusText
      )
      return false
    }

    return true
  } catch (error) {
    console.error("Failed to send Slack message:", error)
    return false
  }
}

export function createKYBNotificationMessage(kybData: {
  id: string
  legal_name: string
  business_name?: string
  entity_type: string
  status: string
  createdAt: string
}): SlackMessage {
  return {
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: "🆕 New KYB Submission",
          emoji: true,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*KYB ID:*\n${kybData.id}`,
          },
          {
            type: "mrkdwn",
            text: `*Status:*\n${kybData.status}`,
          },
          {
            type: "mrkdwn",
            text: `*Legal Name:*\n${kybData.legal_name}`,
          },
          {
            type: "mrkdwn",
            text: `*Business Name:*\n${kybData.business_name || "N/A"}`,
          },
          {
            type: "mrkdwn",
            text: `*Entity Type:*\n${kybData.entity_type}`,
          },
          {
            type: "mrkdwn",
            text: `*Submitted:*\n${new Date(kybData.createdAt).toLocaleString()}`,
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: {
              type: "plain_text",
              text: "Review KYB",
              emoji: true,
            },
            style: "primary",
            url: `https://dashboard.zenobiapay.com/kyb/${kybData.id}`,
          },
        ],
      },
    ],
  }
}

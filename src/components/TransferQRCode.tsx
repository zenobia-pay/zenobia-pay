import {
  Component,
  createSignal,
  createEffect,
  onCleanup,
  Show,
} from "solid-js"
import QRCode from "qrcode"
import { api } from "../services/api"
import { TransferStatus } from "../types/api"

interface TransferQRCodeProps {
  transferRequestId: string
  merchantId: string
  amount?: number
  initialStatus?: TransferStatus
  onStatusChange?: (status: TransferStatus) => void
  pollingInterval?: number
}

const TransferQRCode: Component<TransferQRCodeProps> = (props) => {
  const [qrCodeDataUrl, setQrCodeDataUrl] = createSignal<string | null>(null)
  const [transferStatus, setTransferStatus] =
    createSignal<TransferStatus | null>(props.initialStatus || null)
  const [isPolling, setIsPolling] = createSignal(false)
  const [pollingIntervalId, setPollingIntervalId] = createSignal<number | null>(
    null
  )
  const [error, setError] = createSignal<string | null>(null)

  // Generate QR code on component mount
  createEffect(() => {
    if (props.transferRequestId && props.merchantId) {
      const qrData = {
        transferRequestId: props.transferRequestId,
        merchantId: props.merchantId,
        amount: props.amount,
        status: transferStatus(),
      }

      QRCode.toDataURL(JSON.stringify(qrData), {
        errorCorrectionLevel: "H",
        margin: 1,
        width: 200,
      })
        .then((url) => {
          setQrCodeDataUrl(url)
          // Start polling for transfer status updates
          startPollingTransferStatus(props.transferRequestId)
        })
        .catch((err) => {
          console.error("Error generating QR code:", err)
          setError("Failed to generate QR code")
        })
    }
  })

  // Start polling for transfer status updates
  const startPollingTransferStatus = (transferRequestId: string) => {
    if (isPolling()) return // Prevent multiple polling instances

    setIsPolling(true)

    const intervalId = window.setInterval(async () => {
      try {
        const transferData = await api.getMerchantTransfer(transferRequestId)
        setTransferStatus(transferData.status)

        // Call the onStatusChange callback if provided
        if (props.onStatusChange) {
          props.onStatusChange(transferData.status)
        }

        // Stop polling if transfer is in a terminal state
        if (
          transferData.status === TransferStatus.COMPLETED ||
          transferData.status === TransferStatus.FAILED ||
          transferData.status === TransferStatus.CANCELLED
        ) {
          stopPollingTransferStatus()
        }
      } catch (err) {
        console.error("Error polling transfer status:", err)
        // Don't stop polling on error, just log it
      }
    }, props.pollingInterval || 5000) // Default to 5 seconds if not specified

    setPollingIntervalId(intervalId)
  }

  // Stop polling
  const stopPollingTransferStatus = () => {
    if (pollingIntervalId()) {
      window.clearInterval(pollingIntervalId()!)
      setPollingIntervalId(null)
    }
    setIsPolling(false)
  }

  // Cleanup on component unmount
  onCleanup(() => {
    stopPollingTransferStatus()
  })

  // Function to get badge color based on status
  const getBadgeClass = () => {
    switch (transferStatus()) {
      case TransferStatus.COMPLETED:
        return "badge-success"
      case TransferStatus.FAILED:
      case TransferStatus.CANCELLED:
        return "badge-error"
      case TransferStatus.IN_FLIGHT:
        return "badge-info"
      default:
        return "badge-ghost"
    }
  }

  return (
    <div class="flex flex-col items-center">
      <Show
        when={qrCodeDataUrl()}
        fallback={
          <div class="w-48 h-48 skeleton flex items-center justify-center">
            <span class="loading loading-spinner loading-lg text-primary"></span>
          </div>
        }
      >
        <div class="card bg-base-100 shadow-sm">
          <div class="card-body p-4 items-center">
            <img
              src={qrCodeDataUrl() || ""}
              alt="Transfer QR Code"
              class="w-48 h-48"
            />
            <p class="text-xs opacity-70 text-center mt-2">
              Scan to verify transfer details
            </p>
            <div class="mt-3">
              <div class={`badge ${getBadgeClass()} gap-2`}>
                {isPolling() &&
                transferStatus() !== TransferStatus.COMPLETED &&
                transferStatus() !== TransferStatus.FAILED &&
                transferStatus() !== TransferStatus.CANCELLED ? (
                  <span class="flex items-center">
                    <span class="loading loading-spinner loading-xs"></span>
                    Status: {transferStatus() || "Waiting"}
                  </span>
                ) : (
                  <span>Status: {transferStatus() || "Waiting"}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </Show>
      <Show when={error()}>
        <div class="mt-2 text-xs text-error">{error()}</div>
      </Show>
    </div>
  )
}

export default TransferQRCode

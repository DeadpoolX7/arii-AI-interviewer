import { Alert, AlertDescription } from "@/components/ui/alert"

export function OfflineNotice() {
  const isLocal = sessionStorage.getItem('isLocalSession') === 'true'
  
  if (!isLocal) return null
  
  return (
    <Alert className="mb-4">
      <AlertDescription>
        You are currently in offline mode. Your interview data will be saved locally in your browser.
      </AlertDescription>
    </Alert>
  )
}
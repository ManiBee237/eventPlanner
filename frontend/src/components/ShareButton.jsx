import { toast } from "./Toaster"

export default function ShareButton({ title, text, url = window.location.href, className = "" }){
  async function share(){
    try{
      if (navigator.share) {
        await navigator.share({ title, text, url })
      } else {
        await navigator.clipboard.writeText(url)
        toast("Link copied! 📋")
      }
    }catch{}
  }
  return (
    <button onClick={share} className={className} aria-label="Share">
      🔗 Share
    </button>
  )
}

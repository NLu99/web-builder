import { useParams } from 'react-router-dom'
import { useBuilderStore } from '../store'
import PageRenderer from '../editor/PageRenderer'

export default function Live() {
  const { siteId, pageId } = useParams()
  const site = useBuilderStore((s) => s.sites.find((x) => x.id === siteId))
  const page = site?.pages.find((p) => p.id === pageId)

  if (!site || !page) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-400">Page not found.</div>
    )
  }

  if (!site.published) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-2 text-center">
        <div className="text-lg font-semibold text-zinc-800">This site hasn't been published yet</div>
        <p className="text-sm text-zinc-500">Go back to the editor and hit Publish to make it live.</p>
      </div>
    )
  }

  return (
    <div style={{ background: page.settings.background }} className="min-h-screen overflow-x-hidden py-0">
      <PageRenderer site={site} page={page} viewport="desktop" />
    </div>
  )
}

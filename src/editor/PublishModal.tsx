import { useState } from 'react'
import type { Page, Site } from '../types'
import { useBuilderStore } from '../store'
import PageRenderer from './PageRenderer'

export default function PublishModal({ site, page, onClose }: { site: Site; page: Page; onClose: () => void }) {
  const [previewViewport, setPreviewViewport] = useState<'desktop' | 'mobile'>('desktop')
  const [done, setDone] = useState(site.published)
  const [copied, setCopied] = useState(false)
  const publishSite = useBuilderStore((s) => s.publishSite)

  const liveUrl = `${window.location.origin}${window.location.pathname}#/live/${site.id}/${page.id}`

  function confirmPublish() {
    publishSite(site.id)
    setDone(true)
  }

  function copyLink() {
    navigator.clipboard?.writeText(liveUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-6">
      <div className="flex max-h-[85vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
          <h3 className="text-sm font-semibold text-zinc-900">{done ? 'Your site is live' : 'Preview before publishing'}</h3>
          <button onClick={onClose} aria-label="Close" className="text-zinc-400 hover:text-zinc-600">
            ✕
          </button>
        </div>

        {!done ? (
          <>
            <div className="flex items-center justify-center gap-2 border-b border-zinc-100 py-3">
              {(['desktop', 'mobile'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setPreviewViewport(v)}
                  className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    previewViewport === v ? 'bg-zinc-900 text-white' : 'bg-zinc-100 text-zinc-500'
                  }`}
                >
                  {v}
                </button>
              ))}
            </div>
            <div className="flex-1 overflow-auto bg-zinc-100 p-6">
              <div className="mx-auto w-fit rounded-md border border-zinc-200 bg-white shadow-sm">
                <PageRenderer site={site} page={page} viewport={previewViewport} />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-zinc-100 px-5 py-4">
              <button onClick={onClose} className="rounded-lg px-4 py-2 text-sm font-medium text-zinc-500 hover:bg-zinc-100">
                Cancel
              </button>
              <button
                onClick={confirmPublish}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500"
              >
                Publish
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-4 px-8 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-2xl text-emerald-600">✓</div>
            <p className="text-sm text-zinc-500">Your page is live at</p>
            <div className="flex w-full max-w-md items-center gap-2 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2">
              <span className="flex-1 truncate text-left text-xs text-zinc-600">{liveUrl}</span>
              <button onClick={copyLink} className="flex-none rounded-md bg-zinc-900 px-2.5 py-1 text-[11px] font-medium text-white">
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-50"
              >
                View live site
              </a>
              <button onClick={onClose} className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-500">
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

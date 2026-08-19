import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useBuilderStore } from '../store'

type StartingPoint = 'blank' | 'template'

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function NewSite() {
  const [step, setStep] = useState<1 | 2>(1)
  const [startingPoint, setStartingPoint] = useState<StartingPoint>('blank')
  const [name, setName] = useState('')
  const addSite = useBuilderStore((s) => s.addSite)
  const navigate = useNavigate()

  function choose(point: StartingPoint) {
    setStartingPoint(point)
    setStep(2)
  }

  function create() {
    const finalName = name.trim() || 'Untitled site'
    const id = addSite(finalName, slugify(finalName) || 'site', startingPoint)
    const site = useBuilderStore.getState().getSite(id)
    if (site) navigate(`/site/${id}/edit/${site.pages[0].id}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-10">
      <div className="w-full max-w-2xl">
        <Link to="/dashboard" className="mb-6 inline-block text-sm text-zinc-400 hover:text-zinc-600">
          ← Back to dashboard
        </Link>

        {step === 1 && (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">How do you want to start?</h1>
            <p className="mt-1 text-sm text-zinc-500">You can always change your mind later — nothing here is permanent.</p>

            <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <button
                onClick={() => choose('blank')}
                className="flex flex-col items-start gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-lg">▢</div>
                <div>
                  <div className="font-medium text-zinc-900">Blank canvas</div>
                  <div className="mt-1 text-xs text-zinc-500">Start with a single empty section and build from scratch.</div>
                </div>
              </button>

              <button
                onClick={() => choose('template')}
                className="flex flex-col items-start gap-3 rounded-xl border border-zinc-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-50 text-lg">▦</div>
                <div>
                  <div className="font-medium text-zinc-900">Template</div>
                  <div className="mt-1 text-xs text-zinc-500">Header, hero and footer already in place — just edit the content.</div>
                </div>
              </button>

              <div className="flex cursor-not-allowed flex-col items-start gap-3 rounded-xl border border-dashed border-zinc-200 bg-zinc-50 p-5 text-left opacity-60">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-lg">✨</div>
                <div>
                  <div className="font-medium text-zinc-900">Build from a prompt</div>
                  <div className="mt-1 text-xs text-zinc-500">Describe your site in plain language. Coming soon.</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Name your site</h1>
            <p className="mt-1 text-sm text-zinc-500">
              Starting from {startingPoint === 'blank' ? 'a blank canvas' : 'a template'}.{' '}
              <button className="text-indigo-600 hover:underline" onClick={() => setStep(1)}>
                Change
              </button>
            </p>

            <div className="mt-8">
              <label className="mb-1.5 block text-sm font-medium text-zinc-700">Site name</label>
              <input
                autoFocus
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && create()}
                placeholder="My new site"
                className="w-full rounded-lg border border-zinc-300 px-3.5 py-2.5 text-sm outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              {name.trim() && <p className="mt-1.5 text-xs text-zinc-400">URL: yoursite.com/{slugify(name)}</p>}
            </div>

            <button
              onClick={create}
              className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
            >
              Start editing
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

import { Link, useNavigate } from 'react-router-dom'
import { useBuilderStore } from '../store'

function timeAgo(ts: number) {
  const diff = Date.now() - ts
  const min = Math.floor(diff / 60000)
  if (min < 1) return 'just now'
  if (min < 60) return `${min}m ago`
  const hr = Math.floor(min / 60)
  if (hr < 24) return `${hr}h ago`
  const day = Math.floor(hr / 24)
  return `${day}d ago`
}

export default function Dashboard() {
  const sites = useBuilderStore((s) => s.sites)
  const navigate = useNavigate()

  return (
    <div className="flex h-screen w-full bg-zinc-50">
      <aside className="flex w-56 flex-none flex-col border-r border-zinc-200 bg-white p-4">
        <div className="mb-8 px-2 text-lg font-semibold tracking-tight">Buildable</div>
        <nav className="flex flex-1 flex-col gap-1 text-sm">
          <span className="flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 font-medium text-indigo-700">
            Sites
          </span>
          <span className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-500">Templates</span>
          <span className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-500">Team members: 3</span>
          <Link to="/settings" className="flex items-center gap-2 rounded-lg px-3 py-2 text-zinc-500 hover:bg-zinc-100">
            Settings
          </Link>
        </nav>
        <div className="border-t border-zinc-200 pt-3 text-xs text-zinc-400">Signed in as you</div>
      </aside>

      <main className="flex-1 overflow-y-auto p-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Your sites</h1>
              <p className="mt-1 text-sm text-zinc-500">Pick up where you left off, or start something new.</p>
            </div>
            {sites.length > 0 && (
              <Link
                to="/new"
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                New site
              </Link>
            )}
          </div>

          {sites.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-300 bg-white px-8 py-20 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-indigo-50 text-2xl">
                ✦
              </div>
              <h2 className="text-lg font-semibold text-zinc-900">Create your first site</h2>
              <p className="mt-1.5 max-w-sm text-sm text-zinc-500">
                Start from a blank canvas or a template — you'll land straight in the live editor, no setup maze.
              </p>
              <button
                onClick={() => navigate('/new')}
                className="mt-6 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-500"
              >
                Create your first site
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {sites
                .slice()
                .sort((a, b) => b.updatedAt - a.updatedAt)
                .map((site) => (
                  <button
                    key={site.id}
                    onClick={() => navigate(`/site/${site.id}/edit/${site.pages[0].id}`)}
                    className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className="flex h-32 items-center justify-center bg-gradient-to-br from-indigo-50 to-zinc-100 text-3xl text-indigo-200">
                      {site.name.slice(0, 1).toUpperCase()}
                    </div>
                    <div className="flex flex-1 flex-col gap-1 p-4">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-zinc-900">{site.name}</span>
                        {site.published ? (
                          <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                            Live
                          </span>
                        ) : (
                          <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-medium text-zinc-500">
                            Draft
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-zinc-400">Edited {timeAgo(site.updatedAt)}</span>
                    </div>
                  </button>
                ))}
              <Link
                to="/new"
                className="flex min-h-[176px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-zinc-300 text-zinc-400 hover:border-indigo-300 hover:text-indigo-500"
              >
                <span className="text-2xl">+</span>
                <span className="text-sm font-medium">New site</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

import { Link } from 'react-router-dom'
import { useBuilderStore } from '../store'

export default function AccountSettings() {
  const account = useBuilderStore((s) => s.account)
  const setAdvancedPanelPreference = useBuilderStore((s) => s.setAdvancedPanelPreference)
  const setDeveloperMode = useBuilderStore((s) => s.setDeveloperMode)

  return (
    <div className="min-h-screen bg-zinc-50 px-6 py-10">
      <div className="mx-auto max-w-xl">
        <Link to="/dashboard" className="mb-6 inline-block text-sm text-zinc-400 hover:text-zinc-600">
          ← Back to dashboard
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Editor preferences</h1>
        <p className="mt-1 text-sm text-zinc-500">These follow you across every site you edit.</p>

        <div className="mt-8 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="font-medium text-zinc-900">Advanced panel</div>
          <p className="mt-1 text-sm text-zinc-500">Choose when the block properties panel appears while editing.</p>
          <div className="mt-4 space-y-3">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="advanced-panel"
                checked={account.advancedPanel === 'always'}
                onChange={() => setAdvancedPanelPreference('always')}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-medium text-zinc-800">Always</span>
                <span className="block text-xs text-zinc-500">Opens automatically whenever you select a block.</span>
              </span>
            </label>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="advanced-panel"
                checked={account.advancedPanel === 'invoke-only'}
                onChange={() => setAdvancedPanelPreference('invoke-only')}
                className="mt-1"
              />
              <span>
                <span className="block text-sm font-medium text-zinc-800">Only when I open it</span>
                <span className="block text-xs text-zinc-500">
                  Stays closed until you click "Advanced" on the floating toolbar.
                </span>
              </span>
            </label>
          </div>
        </div>

        <div className="mt-5 rounded-xl border border-zinc-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-zinc-900">Developer mode</div>
              <p className="mt-1 max-w-sm text-sm text-zinc-500">
                Unlocks custom CSS per block, absolute positioning, and custom breakpoints. Independent of the
                Advanced panel setting above.
              </p>
            </div>
            <button
              onClick={() => setDeveloperMode(!account.developerMode)}
              className={`relative h-6 w-11 flex-none rounded-full transition ${
                account.developerMode ? 'bg-indigo-600' : 'bg-zinc-300'
              }`}
            >
              <span
                className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                  account.developerMode ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

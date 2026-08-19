import type { BlockType } from '../types'

const OPTIONS: { type: BlockType; label: string; icon: string; group: string }[] = [
  { type: 'heading', label: 'Heading', icon: 'H', group: 'Text' },
  { type: 'text', label: 'Paragraph', icon: '¶', group: 'Text' },
  { type: 'button', label: 'Button', icon: '▭', group: 'Text' },
  { type: 'image', label: 'Image', icon: '▨', group: 'Media' },
  { type: 'divider', label: 'Divider', icon: '—', group: 'Layout' },
]

export default function BlockPicker({ onPick, onClose }: { onPick: (type: BlockType) => void; onClose: () => void }) {
  const groups = Array.from(new Set(OPTIONS.map((o) => o.group)))
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={onClose}>
      <div
        className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-zinc-900">Add a block</h3>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-600" aria-label="Close">
            ✕
          </button>
        </div>
        {groups.map((group) => (
          <div key={group} className="mb-4 last:mb-0">
            <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">{group}</div>
            <div className="grid grid-cols-3 gap-2">
              {OPTIONS.filter((o) => o.group === group).map((o) => (
                <button
                  key={o.type}
                  onClick={() => onPick(o.type)}
                  className="flex flex-col items-center gap-1.5 rounded-lg border border-zinc-200 py-4 text-xs font-medium text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  <span className="text-lg">{o.icon}</span>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

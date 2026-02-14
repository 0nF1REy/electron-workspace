import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { faWindowMinimize, faXmark } from '@fortawesome/free-solid-svg-icons'

export default function TopBarComponent() {
  const handleClose = () => window.electron.ipcRenderer.send('close-window')
  const handleMinimize = () => window.electron.ipcRenderer.send('minimize-window')

  return (
    <div
      className="bg-metal-dark w-full h-8 flex justify-between items-center px-3 border-b-2 border-metal-medium"
      style={{ WebkitAppRegion: 'drag' }}
    >
      <div className="text-cyan-accent text-sm tracking-widest">Tururu Timer</div>
      <div className="text-cyan-accent" style={{ WebkitAppRegion: 'no-drag' }}>
        <button className="px-3" onClick={handleMinimize}>
          <FontAwesomeIcon icon={faWindowMinimize} />
        </button>
        <button className="px-3" onClick={handleClose}>
          <FontAwesomeIcon icon={faXmark} />
        </button>
      </div>
    </div>
  )
}

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import TopBarComponent from './components/TopBar'
import Timer from './components/Timer'

import bgNormal from './assets/images/background-normal.jpg'
import bgEdit from './assets/images/background-edit.jpg'
import bgFinished from './assets/images/background-finished.png'

function App() {
  const [isOverlay, setIsOverlay] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const toggleOverlay = () => setIsOverlay((prev) => !prev)
    window.electron.ipcRenderer.on('overlay-mode', toggleOverlay)
    return () => window.electron.ipcRenderer.removeAllListeners('overlay-mode')
  }, [])

  return (
    <div
      className="h-screen w-screen overflow-hidden rounded-xl border-2 border-metal-medium bg-cover bg-center transition-all duration-500"
      style={{
        backgroundImage: `url(${isFinished ? bgFinished : isEditing ? bgEdit : bgNormal})`
      }}
    >
      <div
        className={clsx(
          'absolute inset-0 pointer-events-none transition-opacity duration-500',
          !isOverlay && (isEditing ? 'bg-black/80' : 'bg-black/60'),
          isOverlay && 'opacity-0'
        )}
      ></div>

      <div className="relative z-10 flex h-full flex-col">
        <div className={clsx(!isOverlay && 'visible', isOverlay && 'hidden')}>
          <TopBarComponent />
        </div>

        <div className="flex flex-grow items-center justify-center p-2">
          <Timer
            isOverlay={isOverlay}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
            isFinished={isFinished}
            setIsFinished={setIsFinished}
          />
        </div>
      </div>
    </div>
  )
}

export default App

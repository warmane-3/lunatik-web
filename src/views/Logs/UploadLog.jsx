import { useState, useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  startParsing,
  updateParsingProgress,
  completeParsing,
  resetParsing
} from '../../redux/slice/logSlice'
import { uploadLog } from '../../redux/actions/actionsLogs'
import './UploadLog.css'
import CombatLogWorker from '../../workers/combatLog.worker?worker'

const UploadLog = () => {
  const dispatch = useDispatch()
  const { parsing } = useSelector((state) => state.logs)
  const user = useSelector((state) => state.user.userState.userData)
  const [file, setFile] = useState(null)
  const workerRef = useRef(null)

  console.log('user', user)

  useEffect(() => {
    return () => {
      if (workerRef.current) {
        workerRef.current.terminate()
      }
    }
  }, [])

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0]
    if (selectedFile) {
      setFile(selectedFile)
    }
  }

  const handleProcess = () => {
    if (!file) return

    dispatch(startParsing())

    workerRef.current = new CombatLogWorker()

    workerRef.current.onmessage = (e) => {
      const { type, payload } = e.data

      if (type === 'PROGRESS') {
        dispatch(updateParsingProgress(payload))
      } else if (type === 'COMPLETE') {
        dispatch(completeParsing(payload))
        workerRef.current.terminate()
        workerRef.current = null
      }
    }

    workerRef.current.postMessage({ file })
  }

  const handleUpload = () => {
    if (!parsing.result) return

    const logData = {
      logInfo: {
        originalSize: parsing.result.originalSize,
        date: new Date().toISOString()
      },
      fights: parsing.result.fights
    }

    const userData = {
      user: user.user,
      password: user.password // Note: In a real app, use tokens.
    }

    dispatch(uploadLog({ logData, userData }))
  }

  const progressPercent =
    parsing.total > 0 ? (parsing.progress / parsing.total) * 100 : 0

  return (
    <div className='upload-log-container p-6 text-white'>
      <h1 className='text-3xl font-bold mb-6 text-primary'>
        Upload Combat Log
      </h1>

      <div className='card bg-surface-dark p-6 rounded-lg border border-border-color shadow-xl'>
        {!parsing.isParsing && !parsing.result && (
          <div className='file-select flex flex-col items-center gap-4'>
            <input
              type='file'
              accept='.txt'
              onChange={handleFileChange}
              className='hidden'
              id='log-file-input'
            />
            <label
              htmlFor='log-file-input'
              className='cursor-pointer bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded font-bold transition-all'
            >
              Select WoWCombatLog.txt
            </label>
            {file && (
              <p className='text-accent-cyan'>
                Selected: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}{' '}
                MB)
              </p>
            )}
            {file && (
              <button
                onClick={handleProcess}
                className='bg-accent-cyan hover:bg-accent-cyan-light text-background-darker px-8 py-2 rounded font-bold mt-4'
              >
                Start Processing
              </button>
            )}
          </div>
        )}

        {parsing.isParsing && (
          <div className='parsing-status flex flex-col gap-4'>
            <p className='text-xl'>Processing File...</p>
            <div className='w-full bg-background-darker rounded-full h-4 overflow-hidden border border-border-color'>
              <div
                className='bg-primary h-full transition-all duration-300'
                style={{ width: `${progressPercent}%` }}
              ></div>
            </div>
            <div className='flex justify-between text-text-secondary'>
              <span>{progressPercent.toFixed(1)}%</span>
              <span>
                {(parsing.progress / 1024 / 1024).toFixed(1)} /{' '}
                {(parsing.total / 1024 / 1024).toFixed(1)} MB
              </span>
            </div>
            <div className='grid grid-cols-2 gap-4 mt-2'>
              <p className='text-accent-cyan font-bold'>
                Fights: {parsing.fightsCount}
              </p>
              <p className='text-accent-cyan font-bold'>
                Players: {parsing.playersCount}
              </p>
              <p className='text-text-secondary text-sm col-span-2'>
                Lines: {parsing.linesProcessed.toLocaleString()}
              </p>
            </div>
          </div>
        )}

        {parsing.result && (
          <div className='parsing-complete flex flex-col gap-6'>
            <div className='flex items-center gap-2 text-green-400'>
              <span className='text-2xl font-bold'>Processing Complete!</span>
            </div>
            <div className='stats-summary grid grid-cols-2 md:grid-cols-4 gap-4'>
              <div className='stat-item p-4 bg-background-darker rounded border border-border-color'>
                <p className='text-text-muted text-sm uppercase'>
                  Total Fights
                </p>
                <p className='text-2xl font-bold'>
                  {parsing.result.fights.length}
                </p>
              </div>
              <div className='stat-item p-4 bg-background-darker rounded border border-border-color'>
                <p className='text-text-muted text-sm uppercase'>Time Taken</p>
                <p className='text-2xl font-bold'>
                  {parsing.result.duration.toFixed(1)}s
                </p>
              </div>
              <div className='stat-item p-4 bg-background-darker rounded border border-border-color'>
                <p className='text-text-muted text-sm uppercase'>File Size</p>
                <p className='text-2xl font-bold'>
                  {(parsing.result.originalSize / 1024 / 1024).toFixed(1)} MB
                </p>
              </div>
              <div className='stat-item p-4 bg-background-darker rounded border border-border-color'>
                <p className='text-text-muted text-sm uppercase'>Total Lines</p>
                <p className='text-2xl font-bold'>
                  {parsing.result.linesProcessed.toLocaleString()}
                </p>
              </div>
            </div>

            <div className='grid md:grid-cols-2 gap-8'>
              <div className='fights-section'>
                <h2 className='text-xl font-bold mb-4 border-b border-border-color pb-2'>
                  Fight Preview
                </h2>
                <div className='fights-preview-list max-h-60 overflow-y-auto pr-2'>
                  {parsing.result.fights.map((fight, idx) => (
                    <div
                      key={idx}
                      className='flex justify-between p-2 hover:bg-surface-darker rounded transition-all mb-1'
                    >
                      <span className='font-medium'>{fight.boss}</span>
                      <div className='flex gap-4'>
                        <span
                          className={
                            fight.result === 'kill'
                              ? 'text-green-400 font-bold'
                              : 'text-red-400'
                          }
                        >
                          {(fight.result || 'unknown').toUpperCase()}
                        </span>

                        <span className='text-text-secondary'>
                          {(fight.durationMs / 1000 / 60).toFixed(1)}m
                        </span>
                      </div>
                    </div>
                  ))}
                  {parsing.result.fights.length === 0 && (
                    <p className='text-text-muted text-center py-10'>
                      No bosses detected.
                    </p>
                  )}
                </div>
              </div>

              <div className='players-section'>
                <h2 className='text-xl font-bold mb-4 border-b border-border-color pb-2'>
                  Detected Players ({parsing.result.detectedPlayers.length})
                </h2>
                <div className='players-preview-list max-h-60 overflow-y-auto pr-2 grid grid-cols-2 gap-1'>
                  {[...parsing.result.detectedPlayers]
                    .sort()
                    .map((name, idx) => (
                      <div
                        key={idx}
                        className='text-sm p-1 text-text-secondary border-b border-border-color/30'
                      >
                        {name}
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className='actions flex gap-4 mt-4'>
              <button
                onClick={handleUpload}
                className='bg-primary hover:bg-primary-hover text-white px-8 py-3 rounded font-bold transition-all flex-1'
              >
                Upload Results to Server
              </button>
              <button
                onClick={() => {
                  dispatch(resetParsing())
                  setFile(null)
                }}
                className='bg-background-darker hover:bg-surface-darker text-white px-8 py-3 rounded font-bold border border-border-color'
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default UploadLog

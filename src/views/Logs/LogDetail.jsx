import { useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getLogById } from '../../redux/actions/actionsLogs'

const LogDetail = () => {
  const { logId } = useParams()
  const dispatch = useDispatch()
  const { currentLog, loading } = useSelector((state) => state.logs)

  useEffect(() => {
    dispatch(getLogById(logId))
  }, [dispatch, logId])

  if (!currentLog && loading) {
    return (
      <div className='flex justify-center p-20'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
      </div>
    )
  }

  if (!currentLog) return <div className='p-6 text-white'>Log not found.</div>

  return (
    <div className='log-detail-container p-6 text-white max-w-7xl mx-auto'>
      <div className='mb-8'>
        <Link to='/logs' className='text-accent-cyan hover:underline mb-4 inline-block'>&larr; Back to Logs</Link>
        <h1 className='text-3xl font-bold text-primary'>
          Raid Session - {new Date(currentLog.date).toLocaleDateString()}
        </h1>
        <p className='text-text-secondary'>
          Uploaded by: {currentLog.uploadedBy} • Original Size: {(currentLog.originalSize / 1024 / 1024).toFixed(1)} MB
        </p>
      </div>

      <h2 className='text-2xl font-bold mb-4 border-b border-border-color pb-2'>Encounters</h2>
      <div className='grid gap-3'>
        {currentLog.fights?.map((fight) => (
          <Link
            key={fight.id}
            to={`/logs/fight/${fight.id}`}
            className='flex justify-between items-center p-4 bg-surface-dark hover:bg-surface-darker rounded border border-border-color transition-all group'
          >
            <div>
              <span className='text-xl font-bold group-hover:text-primary transition-colors'>{fight.boss}</span>
              <span className='ml-4 text-text-secondary'>{(fight.durationMs / 1000 / 60).toFixed(1)}m</span>
            </div>
            <div className='flex items-center gap-4'>
              <span className={`font-bold px-3 py-1 rounded text-sm ${fight.result === 'kill' ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'}`}>
                {fight.result.toUpperCase()}
              </span>
              <span className='text-text-muted'>&rarr;</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default LogDetail

import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getLogs } from '../../redux/actions/actionsLogs'
import { Link } from 'react-router-dom'

const LogList = () => {
  const dispatch = useDispatch()
  const { logs, loading } = useSelector((state) => state.logs)

  useEffect(() => {
    dispatch(getLogs())
  }, [dispatch])

  return (
    <div className='log-list-container p-6 text-white max-w-7xl mx-auto'>
      <div className='flex justify-between items-center mb-8'>
        <h1 className='text-3xl font-bold text-primary'>Raid Logs</h1>
        <Link
          to='/logs/upload'
          className='bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded font-bold transition-all'
        >
          Upload New Log
        </Link>
      </div>

      {loading ? (
        <div className='flex justify-center p-20'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary'></div>
        </div>
      ) : (
        <div className='grid gap-4'>
          {logs.length > 0 ? (
            logs.map((log) => (
              <Link
                key={log.id}
                to={`/logs/${log.id}`}
                className='card bg-surface-dark p-6 rounded-lg border border-border-color hover:border-primary transition-all flex justify-between items-center group shadow-lg'
              >
                <div>
                  <h3 className='text-xl font-bold group-hover:text-primary transition-colors'>
                    Raid Session - {new Date(log.date).toLocaleDateString()}
                  </h3>
                  <p className='text-text-secondary text-sm'>
                    Uploaded by: <span className='text-accent-cyan'>{log.uploadedBy}</span> • 
                    Size: {(log.originalSize / 1024 / 1024).toFixed(1)} MB
                  </p>
                </div>
                <div className='text-text-muted group-hover:translate-x-1 transition-transform'>
                  <span className='text-2xl'>&rarr;</span>
                </div>
              </Link>
            ))
          ) : (
            <div className='text-center p-20 bg-surface-dark rounded-lg border border-dashed border-border-color'>
              <p className='text-text-secondary text-xl'>No logs found. Be the first to upload one!</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default LogList

'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div>
      <h2>오류가 발생했어요!</h2>
      <button
        onClick={
          () => reset()
        }
      >
        돌아가기
      </button>
    </div>
  )
}

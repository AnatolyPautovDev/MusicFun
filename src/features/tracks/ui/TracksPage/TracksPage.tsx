import { useFetchTracksInfiniteQuery } from "@/features/tracks/api/tracksApi.ts"
import { useInfiniteScroll } from "@/common/hooks"
import { TrackList } from "@/features/tracks/ui/TracksPage/TrackList/TrackList.tsx"
import { LoadingTrigger } from "@/features/tracks/ui/TracksPage/LoadingTrigger/LoadingTrigger.tsx"

export const TracksPage = () => {
  const { data, hasNextPage, isFetching, isFetchingNextPage, fetchNextPage } = useFetchTracksInfiniteQuery()

  const { observerRef } = useInfiniteScroll({ hasNextPage, fetchNextPage, isFetching })

  const pages = data?.pages.flatMap((page) => page.data) || []

  return (
    <div>
      <h1>Tracks page</h1>
      <TrackList tracks={pages} />
      {hasNextPage && <LoadingTrigger observerRef={observerRef} isFetchingNextPage={isFetchingNextPage} />}
      {!hasNextPage && pages.length > 0 && <p>Nothing more to load</p>}
    </div>
  )
}

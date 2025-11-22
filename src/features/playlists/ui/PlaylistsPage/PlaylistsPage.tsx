import { type ChangeEvent, useState } from "react"
import { useFetchPlaylistsQuery } from "@/features/playlists/api"
import { CreatePlaylistForm } from "@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm"
import s from "./PlaylistsPage.module.css"
import { useDebounceValue } from "@/common/hooks"
import { Pagination } from "@/common/components"
import { PlaylistsList } from "@/features/playlists/ui/PlaylistsPage/PlaylistsList/PlaylistsList.tsx"

export const PlaylistsPage = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(4)

  const [search, setSearch] = useState("")
  const debounceSearch = useDebounceValue(search)

  const { data, isLoading } = useFetchPlaylistsQuery(
    {
      search: debounceSearch,
      pageNumber: currentPage,
      pageSize,
    },
    {
      // refetchOnFocus: true,
      // pollingInterval: 60000,
      // skipPollingIfUnfocused: true
    },
  )

  const setPageSizeHandler = (size: number) => {
    setCurrentPage(1)
    setPageSize(size)
  }
  const searchPlaylistHandler = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.currentTarget.value)
    setCurrentPage(1)
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <input type="search" placeholder={"Search playlist by title"} onChange={searchPlaylistHandler} />
      <PlaylistsList isPlaylistsLoading={isLoading} playlists={data?.data || []} />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pagesCount={data?.meta.pagesCount || 1}
        pageSize={pageSize}
        setPageSize={setPageSizeHandler}
      />
    </div>
  )
}

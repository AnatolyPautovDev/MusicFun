import { useState } from 'react'
import { useForm } from 'react-hook-form'
import type { PlaylistData, UpdatePlaylistArgs } from '@/features/playlists/api/playlists.types.ts'
import { useFetchPlaylistsQuery } from '@/features/playlists/api/playlistsApi.ts'
import { CreatePlaylistForm } from '@/features/playlists/ui/PlaylistsPage/CreatePlaylistForm/CreatePlaylistForm.tsx'
import s from './PlaylistsPage.module.css'
import { PlaylistItem } from '@/features/playlists/ui/PlaylistsPage/PlaylistItem/PlaylistItem.tsx'
import { EditPlaylistForm } from '@/features/playlists/ui/PlaylistsPage/EditPlaylistForm/EditPlaylistForm.tsx'

export const PlaylistsPage = () => {
  const [playlistId, setPlaylistId] = useState<string | null>(null)
  const { register, handleSubmit, reset } = useForm<UpdatePlaylistArgs>()

  const { data } = useFetchPlaylistsQuery()

  const editPlaylistHandler = (playlist: PlaylistData | null) => {
    if (playlist) {
      setPlaylistId(playlist.id)
      reset({
        title: playlist.attributes.title,
        description: playlist.attributes.description,
        tagIds: playlist.attributes.tags.map((t) => t.id),
      })
    } else {
      setPlaylistId(null)
    }
  }

  return (
    <div className={s.container}>
      <h1>Playlists page</h1>
      <CreatePlaylistForm />
      <div className={s.items}>
        {data?.data.map((playlist) => {
          const isEditing = playlistId === playlist.id

          return (
            <div className={s.item} key={playlist.id}>
              {isEditing ? (
                <EditPlaylistForm
                  playlistId={playlistId}
                  setPlaylistId={setPlaylistId}
                  editPlaylist={editPlaylistHandler}
                  register={register}
                  handleSubmit={handleSubmit}
                />
              ) : (
                <PlaylistItem playlist={playlist} editPlaylist={editPlaylistHandler} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

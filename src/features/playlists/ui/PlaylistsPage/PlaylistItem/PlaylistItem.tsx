import type { PlaylistData } from '@/features/playlists/api/playlists.types.ts'
import { useDeletePlaylistMutation } from '@/features/playlists/api/playlistsApi.ts'

type Props = {
  playlist: PlaylistData
  editPlaylist: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylist }: Props) => {
  const [deletePlaylist] = useDeletePlaylistMutation()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm('Are you sure you want to delete the playlist?')) {
      deletePlaylist(playlistId)
    }
  }

  return (
    <div>
      <div>title: {playlist.attributes.title}</div>
      <div>description: {playlist.attributes.description}</div>
      <div>userName: {playlist.attributes.user.name}</div>
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylist(playlist)}>update</button>
    </div>
  )
}

import { type PlaylistData, useDeletePlaylistMutation } from "@/features/playlists/api"
import { PlaylistCover } from "./PlaylistCover/PlaylistCover.tsx"
import { PlaylistDescription } from "./PlaylistDescription/PlaylistDescription.tsx"

type Props = {
  playlist: PlaylistData
  editPlaylist: (playlist: PlaylistData) => void
}

export const PlaylistItem = ({ playlist, editPlaylist }: Props) => {
  const [deletePlaylist] = useDeletePlaylistMutation()

  const deletePlaylistHandler = (playlistId: string) => {
    if (confirm("Are you sure you want to delete the playlist?")) {
      deletePlaylist(playlistId)
    }
  }

  return (
    <div>
      <PlaylistCover playlistId={playlist.id} images={playlist.attributes.images} />
      <PlaylistDescription attributes={playlist.attributes} />
      <button onClick={() => deletePlaylistHandler(playlist.id)}>delete</button>
      <button onClick={() => editPlaylist(playlist)}>update</button>
    </div>
  )
}

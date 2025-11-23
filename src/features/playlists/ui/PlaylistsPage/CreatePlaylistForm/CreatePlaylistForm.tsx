import { type SubmitHandler, useForm } from "react-hook-form"
import type { CreatePlaylistArgs } from "@/features/playlists/api"
import { useCreatePlaylistMutation } from "@/features/playlists/api"

type Props = {
  setCurrentPage: (page: number) => void
}

export const CreatePlaylistForm = ({ setCurrentPage }: Props) => {
  const { register, handleSubmit, reset } = useForm<CreatePlaylistArgs>()

  const [createPlaylists] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    createPlaylists(data)
      .unwrap()
      .then(() => {
        setCurrentPage(1)
        reset()
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register("title")} placeholder={"title"} />
      </div>
      <div>
        <input {...register("description")} placeholder={"description"} />
      </div>
      <button>create playlist</button>
    </form>
  )
}

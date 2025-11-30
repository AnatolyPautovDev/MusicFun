import { type SubmitHandler, useForm } from "react-hook-form"
import type { CreatePlaylistArgs } from "@/features/playlists/api"
import { useCreatePlaylistMutation } from "@/features/playlists/api"
import { zodResolver } from "@hookform/resolvers/zod"
import { createPlaylistSchema } from "@/features/playlists/model/playlists.schemas.ts"
import s from "./CreatePlaylistForm.module.css"

type Props = {
  setCurrentPage?: (page: number) => void
}

export const CreatePlaylistForm = ({ setCurrentPage }: Props) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreatePlaylistArgs>({
    resolver: zodResolver(createPlaylistSchema),
  })

  const [createPlaylists] = useCreatePlaylistMutation()

  const onSubmit: SubmitHandler<CreatePlaylistArgs> = (data) => {
    createPlaylists(data)
      .unwrap()
      .then(() => {
        if (setCurrentPage) {
          setCurrentPage(1)
        }
        reset()
      })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2>Create new playlist</h2>
      <div>
        <input {...register("title")} placeholder={"title"} />
        {errors.title && <span className={s.error}>{errors.title.message}</span>}
      </div>
      <div>
        <input {...register("description")} placeholder={"description"} />
        {errors.description && <span className={s.error}>{errors.description.message}</span>}
      </div>
      <button>create playlist</button>
    </form>
  )
}

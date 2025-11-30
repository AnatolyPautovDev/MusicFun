import type {
  CreatePlaylistArgs,
  FetchPlaylistsArgs,
  PlaylistCreatedEvent,
  PlaylistsResponse,
  PlaylistUpdatedEvent,
  UpdatePlaylistArgs,
} from "@/features/playlists/api/"
import { baseApi } from "@/app/api/baseApi.ts"
import type { Images } from "@/common/types"
import { playlistCreateResponseSchema, playlistsResponseSchema } from "@/features/playlists/model/playlists.schemas.ts"
import { imagesSchema } from "@/common/schemas"
import { withZodCatch } from "@/common/utils"
import { SOCKET_EVENTS } from "@/common/constants"
import { subscribeToEvent } from "@/common/socket"

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, FetchPlaylistsArgs>({
      query(params) {
        return { url: "/playlists", params }
      },
      ...withZodCatch(playlistsResponseSchema),
      keepUnusedDataFor: 0,
      onCacheEntryAdded: async (_arg, { cacheDataLoaded, updateCachedData, cacheEntryRemoved }) => {
        await cacheDataLoaded

        const unsubscribes = [
          subscribeToEvent<PlaylistCreatedEvent>(SOCKET_EVENTS.PLAYLIST_CREATED, (msg) => {
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              state.data.unshift(newPlaylist)
              state.data.pop()
              state.meta.totalCount += 1
              state.meta.pagesCount = Math.ceil(state.meta.totalCount / state.meta.pageSize)
            })
          }),
          subscribeToEvent<PlaylistUpdatedEvent>(SOCKET_EVENTS.PLAYLIST_UPDATED, (msg) => {
            const newPlaylist = msg.payload.data
            updateCachedData((state) => {
              const index = state.data.findIndex((pl) => pl.id === newPlaylist.id)
              if (index !== -1) {
                state.data[index] = { ...state.data[index], ...newPlaylist }
              }
            })
          }),
        ]

        await cacheEntryRemoved
        unsubscribes.forEach((unsubscribe) => unsubscribe())
      },
      providesTags: ["Playlists"],
    }),
    createPlaylist: build.mutation({
      query: (body: CreatePlaylistArgs) => ({ method: "post", url: "/playlists", body }),
      ...withZodCatch(playlistCreateResponseSchema),
      invalidatesTags: ["Playlists"],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ method: "delete", url: `/playlists/${playlistId}` }),
      invalidatesTags: ["Playlists"],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({ method: "put", url: `/playlists/${playlistId}`, body }),
      invalidatesTags: ["Playlists"],
      onQueryStarted: async ({ playlistId, body }, { dispatch, queryFulfilled, getState }) => {
        const args = playlistsApi.util.selectCachedArgsForQuery(getState(), "fetchPlaylists")
        const patchResults: any[] = []
        args.forEach((arg) => {
          patchResults.push(
            dispatch(
              playlistsApi.util.updateQueryData("fetchPlaylists", arg, (state) => {
                const playlist = state.data.find((pl) => pl.id === playlistId)
                if (playlist) {
                  playlist.attributes = { ...playlist.attributes, ...body }
                }
              }),
            ),
          )
        })
        try {
          await queryFulfilled
        } catch {
          patchResults.forEach((patchResult) => {
            patchResult.undo()
          })
        }
      },
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append("file", file)
        return { method: "post", url: `/playlists/${playlistId}/images/main`, body: formData }
      },
      ...withZodCatch(imagesSchema),
      invalidatesTags: ["Playlists"],
    }),
    deletePlaylistCover: build.mutation<void, string>({
      query: (playlistId) => ({ method: "delete", url: `/playlists/${playlistId}/images/main` }),
      invalidatesTags: ["Playlists"],
    }),
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
  useUploadPlaylistCoverMutation,
  useDeletePlaylistCoverMutation,
} = playlistsApi

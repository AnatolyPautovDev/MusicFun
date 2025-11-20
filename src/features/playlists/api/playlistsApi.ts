import type { CreatePlaylistArgs, PlaylistData, PlaylistsResponse, UpdatePlaylistArgs } from '@/features/playlists/api/'
import { baseApi } from '@/app/api/baseApi.ts'
import type { Images } from '@/common/types'

export const playlistsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    fetchPlaylists: build.query<PlaylistsResponse, void>({
      query: () => '/playlists',
      providesTags: ['Playlists'],
    }),
    createPlaylist: build.mutation<{ data: PlaylistData }, CreatePlaylistArgs>({
      query: (body) => ({ method: 'post', url: '/playlists', body }),
      invalidatesTags: ['Playlists'],
    }),
    deletePlaylist: build.mutation<void, string>({
      query: (playlistId) => ({ method: 'delete', url: `/playlists/${playlistId}` }),
      invalidatesTags: ['Playlists'],
    }),
    updatePlaylist: build.mutation<void, { playlistId: string; body: UpdatePlaylistArgs }>({
      query: ({ playlistId, body }) => ({ method: 'put', url: `/playlists/${playlistId}`, body }),
      invalidatesTags: ['Playlists'],
    }),
    uploadPlaylistCover: build.mutation<Images, { playlistId: string; file: File }>({
      query: ({ playlistId, file }) => {
        const formData = new FormData()
        formData.append('file', file)
        return { method: 'post', url: `/playlists/${playlistId}/images/main`, body: formData }
      },
      invalidatesTags: ['Playlists'],
    }),
    deletePlaylistCover: build.mutation<void, string>({
      query: (playlistId) => ({ method: 'delete', url: `/playlists/${playlistId}/images/main` }),
      invalidatesTags: ['Playlists'],
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

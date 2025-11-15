import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type {
  CreatePlaylistArgs,
  PlaylistData,
  PlaylistsResponse,
  UpdatePlaylistArgs,
} from '@/features/playlists/api/playlists.types.ts'

export const playlistsApi = createApi({
  reducerPath: 'playlistsApi',
  tagTypes: ['Playlists'],
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    headers: {
      'API-KEY': import.meta.env.VITE_API_KEY,
    },
    prepareHeaders: (headers) => {
      headers.set('Authorization', `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
      return headers
    },
  }),
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
  }),
})

export const {
  useFetchPlaylistsQuery,
  useCreatePlaylistMutation,
  useDeletePlaylistMutation,
  useUpdatePlaylistMutation,
} = playlistsApi

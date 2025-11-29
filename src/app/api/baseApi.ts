import { createApi } from "@reduxjs/toolkit/query/react"
import { baseQueryWithReauth } from "@/app/api/baseQueryWithReauth.ts"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Playlists", "Auth"],
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
})

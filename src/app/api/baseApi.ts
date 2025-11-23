import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { handleErrors } from "@/common/utils"

export const baseApi = createApi({
  reducerPath: "baseApi",
  tagTypes: ["Playlists"],
  baseQuery: async (args, api, extraOptions) => {
    // await new Promise((res) => setTimeout(res, 1000))
    const res = await fetchBaseQuery({
      baseUrl: import.meta.env.VITE_BASE_URL,
      headers: {
        "API-KEY": import.meta.env.VITE_API_KEY,
      },
      prepareHeaders: (headers) => {
        headers.set("Authorization", `Bearer ${import.meta.env.VITE_ACCESS_TOKEN}`)
        return headers
      },
    })(args, api, extraOptions)

    if (res.error) {
      handleErrors(res.error)
    }

    return res
  },
  endpoints: () => ({}),
})

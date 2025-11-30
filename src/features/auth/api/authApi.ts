import { baseApi } from "@/app/api/baseApi.ts"
import type { LoginArgs, MeResponse } from "@/features/auth/api/authApi.types.ts"
import { AUTH_KEYS } from "@/common/constants"
import { withZodCatch } from "@/common/utils"
import { loginResponseSchema, meResponseSchema } from "@/features/auth/model/auth.schemas.ts"

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<MeResponse, void>({
      query: () => `auth/me`,
      ...withZodCatch(meResponseSchema),
      providesTags: ["Auth"],
    }),
    login: build.mutation({
      query: (payload: LoginArgs) => ({
        method: "post",
        url: "auth/login",
        body: { ...payload, accessTokenTTL: "10m" },
      }),
      onQueryStarted: async (_args, { queryFulfilled, dispatch }) => {
        const { data } = await queryFulfilled
        localStorage.setItem(AUTH_KEYS.accessToken, data.accessToken)
        localStorage.setItem(AUTH_KEYS.refreshToken, data.refreshToken)
        dispatch(authApi.util.invalidateTags(["Auth"]))
      },
      ...withZodCatch(loginResponseSchema),
    }),
    logout: build.mutation<void, void>({
      query: () => {
        const refreshToken = localStorage.getItem(AUTH_KEYS.refreshToken)
        return { method: "post", url: "auth/logout", body: { refreshToken } }
      },
      onQueryStarted: async (_args, { queryFulfilled, dispatch }) => {
        await queryFulfilled
        localStorage.removeItem(AUTH_KEYS.accessToken)
        localStorage.removeItem(AUTH_KEYS.refreshToken)
        dispatch(baseApi.util.resetApiState())
      },
    }),
  }),
})

export const { useGetMeQuery, useLoginMutation, useLogoutMutation } = authApi

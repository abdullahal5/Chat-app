import { baseApi } from "../../api/baseApi";

const userManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    addUser: builder.mutation({
      query: (data) => {
        return {
          url: `/user/create-user`,
          method: "POST",
          body: data,
        };
      },
    }),
    login: builder.mutation({
      query: (userInfo) => ({
        url: "/user/login",
        method: "POST",
        body: userInfo,
      }),
    }),
    getAllUser: builder.query({
      query: () => {
        // console.log(params);
        return {
          url: `/user/get-all-user`,
          method: "GET",
        };
      },
    }),
  }),
});

export const { useAddUserMutation, useLoginMutation, useGetAllUserQuery } =
  userManagementApi;

import { baseApi } from "../../api/baseApi";

const chatManagementApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUserBySearch: builder.query({
      query: (search) => {
        return {
          url: `/user/get-all-user?search=${search}`,
          method: "GET",
        };
      },
    }),
    accessChat: builder.mutation({
      query: (userId) => {
        return {
          url: `/chat/create-chat`,
          method: "POST",
          body: { userId },
        };
      },
    }),
    myChats: builder.query({
      query: () => {
        return {
          url: `/chat/get-all-chat`,
          method: "GET",
        };
      },
    }),
    createGroupChat: builder.mutation({
      query: (payload) => {
        console.log(payload);
        return {
          url: `/chat/create-group-chat`,
          method: "POST",
          body: {
            name: payload.name,
            users: JSON.stringify(payload?.users?.map((user) => user._id)),
          },
        };
      },
    }),
  }),
});

export const {
  useGetUserBySearchQuery,
  useAccessChatMutation,
  useMyChatsQuery,
  useCreateGroupChatMutation,
} = chatManagementApi;

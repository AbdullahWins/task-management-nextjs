import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { authSlice } from "./authSlice";


type TaskTags = { type: "Tasks"; id: "LIST" };

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:5000/api/v1",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Tasks"],
  endpoints: (builder) => ({
    getUser: builder.query({
      query: (userId) => ({
        url: `/users/find/${userId}`,
        method: "GET",
      }),
      onQueryStarted: async (userId, { dispatch, queryFulfilled }) => {
        try {
          const { data } = await queryFulfilled;
          dispatch(
            authSlice.actions.signinSuccess({
              user: data.data,
              accessToken: localStorage.getItem("accessToken") || "",
            })
          );
        } catch (err) {
          console.error("Error fetching user data:", err);
        }
      },
    }),
    signup: builder.mutation({
      query: (data) => ({
        url: "/users/signup",
        method: "POST",
        body: data,
      }),
    }),
    signin: builder.mutation({
      query: (data) => ({
        url: "/users/signin",
        method: "POST",
        body: data,
      }),
    }),

    // Task APIs
    getTasks: builder.query({
      query: () => ({
        url: "/tasks/own",
        method: "GET",
      }),
      providesTags: ["Tasks"],
    }),
    addTask: builder.mutation({
      query: (taskData) => ({
        url: "/tasks/add",
        method: "POST",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTask: builder.mutation({
      query: (taskData) => ({
        url: `/tasks/update/${taskData._id}`,
        method: "PATCH",
        body: taskData,
      }),
      invalidatesTags: ["Tasks"],
    }),
    updateTaskStatus: builder.mutation({
      query: ({ _id, status }) => ({
        url: `/tasks/update-status/${_id}`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Tasks"],
    }),
    deleteTask: builder.mutation({
      query: (_id) => ({
        url: `/tasks/delete/${_id}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useSigninMutation,
  useGetUserQuery,
  useGetTasksQuery,
  useAddTaskMutation,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
  useDeleteTaskMutation,
} = api;

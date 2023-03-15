import { io } from "socket.io-client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const location = document.location;
const token = localStorage.getItem('token');
const socket = io(`wss://chatback.fly.dev:3001`, {
  transportOptions: {
    polling: {
      extraHeaders: {
        'Authorization': `Bearer ${token}`,
      },
    },
  },
});
// const socket = io(`ws://localhost:3001`, {
//   transportOptions: {
//     polling: {
//       extraHeaders: {
//         'Authorization': `Bearer ${token}`,
//       },
//     },
//   },
// });

type Message = {
  owner: string;
  text: string;
  _id: string;
  userName: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://chatback.fly.dev:3001'}),
  // baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001'}),
  tagTypes: ['Messaages'],
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (user: {}) => ({
        url: 'signup',
        method: 'POST',
        body: user,
      })
    }),
    signin: builder.mutation({
      query: (user: {}) => ({
        url: 'signin',
        method: 'POST',
        body: user,
      })
    }),
    checkToken: builder.mutation({
      query: (token) => ({
        url: 'users/me',
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'authorization': `Bearer ${token}`
        },
      })
    }),
    allMessages: builder.query<Message[], string | null>({
      query: (token) => ({
        url: 'messages',
        method: 'GET',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'authorization': `Bearer ${token}`
        },
      }),
      providesTags: ['Messaages'],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded
          const listener = (messages: Message) => {
            updateCachedData((draft) => {
              draft.push(messages)
            })
          }
          socket.on('getAllmessages', listener)
        } catch {
        }
        await cacheEntryRemoved
        socket.close()
      }
    }),
    sendMessage: builder.mutation({
      query: ({ token, message }) => ({
        url: 'messages',
        method: 'POST',
        body: message,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
          'authorization': `Bearer ${token}`
        },
      }),
      invalidatesTags: ['Messaages'],
      async onQueryStarted(arg) {
        socket.emit('sendAllMessages', arg.message)
      }
    })
  }),

})

export const { useSignupMutation, useSigninMutation, useCheckTokenMutation, useAllMessagesQuery, useSendMessageMutation } = chatApi
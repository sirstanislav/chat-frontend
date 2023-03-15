import { io } from "socket.io-client";
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const socket = io('ws://chat-backend-gtmd.onrender.com:3001');

type Message = {
  owner: string;
  text: string;
  _id: string;
  userName: string;
}

export const chatApi = createApi({
  reducerPath: 'chatApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://chat-backend-gtmd.onrender.com/'}),
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
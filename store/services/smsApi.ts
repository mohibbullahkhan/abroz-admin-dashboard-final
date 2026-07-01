import { baseApi } from '../api/baseApi';

// ── Types ─────────────────────────────────────────────────────────────────────
export interface SmsRecipient {
  id: number;
  name: string;
  phone: string;
}

export interface SmsBroadcast {
  id: number;
  message: string;
  recipients_count: number;
  status: 'pending' | 'sent' | 'failed';
  sent_at?: string;
  created_at: string;
}

export interface SendSmsRequest {
  message: string;
  recipient_ids?: number[];   // specific recipients; omit for broadcast-all
}

// ── SMS API slice ──────────────────────────────────────────────────────────────
export const smsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    // GET /sms/broadcasts
    getSmsBroadcasts: builder.query<SmsBroadcast[], void>({
      query: () => '/sms/broadcasts',
      providesTags: ['SMS'],
    }),

    // POST /sms/send
    sendSms: builder.mutation<SmsBroadcast, SendSmsRequest>({
      query: (body) => ({
        url: '/sms/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['SMS'],
    }),

    // GET /sms/recipients
    getSmsRecipients: builder.query<SmsRecipient[], void>({
      query: () => '/sms/recipients',
      providesTags: ['SMS'],
    }),

  }),
  overrideExisting: false,
});

export const {
  useGetSmsBroadcastsQuery,
  useSendSmsMutation,
  useGetSmsRecipientsQuery,
} = smsApi;

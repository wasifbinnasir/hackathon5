import { apiBase } from './apiBase';

export const authApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    register: b.mutation<any, { name: string; email: string; username: string; mobileNumber: string; password: string }>({
      query: (body) => ({ url: '/auth/register', method: 'POST', body }),
    }),
    login: b.mutation<any, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
    }),
    me: b.query<any, void>({ query: () => '/auth/me', providesTags: ['Me'] }),
  }),
});

export const usersApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    getMe: b.query<any, void>({ query: () => '/users/me', providesTags: ['Me'] }),
    updatePersonal: b.mutation<any, Partial<any>>({
      query: (body) => ({ url: '/users/me/personal', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    updateAddress: b.mutation<any, Partial<any>>({
      query: (body) => ({ url: '/users/me/address', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    updateTraffic: b.mutation<any, Partial<any>>({
      query: (body) => ({ url: '/users/me/traffic', method: 'PATCH', body }),
      invalidatesTags: ['Me'],
    }),
    myCars: b.query<any[], void>({ query: () => '/users/me/cars', providesTags: ['Cars'] }),
    myBids: b.query<any[], void>({
      query: () => '/users/me/bids',
      providesTags: ['Bids', 'Auctions'],
    }),
    myWishlist: b.query<any[], void>({ query: () => '/users/me/wishlist', providesTags: ['Wishlist'] }),
  }),
});

export const carsApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    createCar: b.mutation<any, any>({ query: (body) => ({ url: '/cars', method: 'POST', body }), invalidatesTags: ['Cars'] }),
    listCars: b.query<{ items: any[]; total: number; page: number; limit: number }, any>({
      query: (q) => ({ url: '/cars', params: q }),
      providesTags: ['Cars'],
    }),
    getCar: b.query<any, string>({ query: (id) => `/cars/${id}` }),
  }),
});

export const auctionsApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    createAuction: b.mutation<any, { carId: string; startTime: string; endTime: string; startingPrice: number }>({
      query: (body) => ({ url: '/auctions', method: 'POST', body }),
      invalidatesTags: ['Auctions'],
    }),
    listAuctions: b.query<{ items: any[]; total: number }, any>({
      query: (q) => ({ url: '/auctions', params: q }),
      providesTags: ['Auctions'],
    }),
    liveAuctions: b.query<any[], void>({ query: () => '/auctions/live', providesTags: ['Auctions'] }),
    getAuction: b.query<any, string>({ query: (id) => `/auctions/${id}` }),
    relatedAuctions: b.query<any[], string>({ query: (id) => `/auctions/${id}/related` }),
  }),
});

export const bidsApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    placeBid: b.mutation<any, { auctionId: string; amount: number }>({
      query: (body) => ({ url: '/bids', method: 'POST', body }),
      invalidatesTags: (_res, _err, arg) => [{ type: 'Bids', id: arg.auctionId }, 'Auctions'],
    }),
    topBids: b.query<any[], { auctionId: string; limit?: number }>({
      query: ({ auctionId, limit = 10 }) => `/auctions/${auctionId}/bids?limit=${limit}`,
      providesTags: (_r, _e, arg) => [{ type: 'Bids', id: arg.auctionId }],
    }),
  }),
});

export const wishlistApi = apiBase.injectEndpoints({
  endpoints: (b) => ({
    addWishlist: b.mutation<any, { carId: string }>({
      query: (body) => ({ url: '/wishlist', method: 'POST', body }),
      invalidatesTags: ['Wishlist'],
    }),
    removeWishlist: b.mutation<any, string>({
      query: (carId) => ({ url: `/wishlist/${carId}`, method: 'DELETE' }),
      invalidatesTags: ['Wishlist'],
    }),
  }),
});

export const {
  useRegisterMutation,
  useLoginMutation,
  useMeQuery,
} = authApi;
export const {
  useGetMeQuery,
  useUpdatePersonalMutation,
  useUpdateAddressMutation,
  useUpdateTrafficMutation,
  useMyCarsQuery,
  useMyBidsQuery,
  useMyWishlistQuery,
} = usersApi;
export const {
  useCreateCarMutation,
  useListCarsQuery,
  useGetCarQuery,
} = carsApi;
export const {
  useCreateAuctionMutation,
  useListAuctionsQuery,
  useLiveAuctionsQuery,
  useGetAuctionQuery,
  useRelatedAuctionsQuery,
  useLazyListAuctionsQuery
} = auctionsApi;
export const {
  usePlaceBidMutation,
  useTopBidsQuery,
} = bidsApi;
export const {
  useAddWishlistMutation,
  useRemoveWishlistMutation,
} = wishlistApi;
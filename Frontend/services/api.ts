export const ApiBaseUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:5000/api";

export const ApiRoutes = {
  auth: {
    register: "/auth/register",
    login: "/auth/login",
    logout: "/auth/logout",
  },
  user: {
    me: "/users/me",
    avatar: "/users/me/avatar",
  },
  songs: {
    root: "/songs",
    upload: "/songs/upload",
    stream: (id: string) => `/songs/stream/${id}`,
    bySlug: (slug: string) => `/songs/${slug}`,
    delete: (id: string) => `/songs/${id}`,
    mostPlayed: "/songs/trending/most-played",
    recent: "/songs/trending/recent",
    recordPlay: (id: string) => `/songs/${id}/play`,
  },
  playlists: {
    root: "/playlists",
    playlist: (playlistId: string) => `/playlists/${playlistId}`,
    songs: (playlistId: string) => `/playlists/${playlistId}/songs`,
  },
  favorites: {
    root: "/favorites",
    check: (id: string) => `/favorites/check/${id}`,
    add: (id: string) => `/favorites/${id}`,
    remove: (id: string) => `/favorites/${id}`,
  },
  albums: {
    root: "/albums",
    byId: (id: string) => `/albums/${id}`,
    bySlug: (slug: string) => `/albums/slug/${slug}`,
    songs: (id: string) => `/albums/${id}/songs`,
  },
  artists: {
    root: "/artists",
    request: "/artists/request",
    myStatus: "/artists/my-status",
    byId: (id: string) => `/artists/${id}`,
  },
};

import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition: swaggerJSDoc.Options["definition"] = {
  openapi: "3.0.3",
  info: {
    title: "Chuchify API",
    version: "1.0.0",
    description: "API documentation for the Chuchify music player backend.",
  },
  servers: [
    {
      url: "http://localhost:5000/api",
      description: "Local development server",
    },
  ],
  paths: {
    "/users/me": {
      get: { tags: ["Users"], summary: "Get the current user", security: [{ bearerAuth: [] }], responses: { "200": { description: "Current user" }, "401": { description: "Unauthorized" } } },
    },
    "/users/me/avatar": {
      put: { tags: ["Users"], summary: "Update the current user's avatar", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "multipart/form-data": { schema: { type: "object", required: ["avatar"], properties: { avatar: { type: "string", format: "binary" } } } } } }, responses: { "200": { description: "Avatar updated" }, "401": { description: "Unauthorized" } } },
    },
    "/songs": {
      get: { tags: ["Songs"], summary: "List songs", parameters: [{ name: "q", in: "query", schema: { type: "string" }, description: "Optional search term" }], responses: { "200": { description: "Song list" } } },
    },
    "/songs/{slug}": {
      get: { tags: ["Songs"], summary: "Get a song by slug", parameters: [{ $ref: "#/components/parameters/Slug" }], responses: { "200": { description: "Song details" }, "404": { description: "Song not found" } } },
    },
    "/songs/stream/{id}": {
      get: { tags: ["Songs"], summary: "Stream a song", parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Audio stream" } } },
    },
    "/songs/trending/most-played": {
      get: { tags: ["Songs"], summary: "Get most played songs", responses: { "200": { description: "Most played songs" } } },
    },
    "/songs/trending/recent": {
      get: { tags: ["Songs"], summary: "Get recently added songs", responses: { "200": { description: "Recent songs" } } },
    },
    "/songs/{id}/play": {
      post: { tags: ["Songs"], summary: "Record a song play", parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Play recorded" } } },
    },
    "/songs/upload": {
      post: { tags: ["Songs"], summary: "Upload a song", security: [{ bearerAuth: [] }], requestBody: { required: true, content: { "multipart/form-data": { schema: { type: "object", required: ["file"], properties: { file: { type: "string", format: "binary" }, coverImage: { type: "string", format: "binary" } } } } } }, responses: { "201": { description: "Song uploaded" }, "401": { description: "Unauthorized" } } },
    },
    "/artists": {
      get: { tags: ["Artists"], summary: "List artists", responses: { "200": { description: "Artist list" } } },
    },
    "/artists/{id}": {
      get: { tags: ["Artists"], summary: "Get an artist", parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Artist details" } } },
    },
    "/artists/request": {
      post: { tags: ["Artists"], summary: "Request artist role", security: [{ bearerAuth: [] }], responses: { "201": { description: "Request submitted" } } },
    },
    "/artists/my-status": {
      get: { tags: ["Artists"], summary: "Get artist request status", security: [{ bearerAuth: [] }], responses: { "200": { description: "Request status" } } },
    },
    "/artists/{requestId}/approve": {
      patch: { tags: ["Artists"], summary: "Approve an artist request", security: [{ bearerAuth: [] }], parameters: [{ name: "requestId", in: "path", required: true, schema: { type: "string" } }], responses: { "200": { description: "Request approved" } } },
    },
    "/playlists": {
      get: { tags: ["Playlists"], summary: "List the current user's playlists", security: [{ bearerAuth: [] }], responses: { "200": { description: "Playlist list" } } },
      post: { tags: ["Playlists"], summary: "Create a playlist", security: [{ bearerAuth: [] }], responses: { "201": { description: "Playlist created" } } },
    },
    "/playlists/{id}": {
      get: { tags: ["Playlists"], summary: "Get a playlist", security: [{ bearerAuth: [] }], parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Playlist details" } } },
      delete: { tags: ["Playlists"], summary: "Delete a playlist", security: [{ bearerAuth: [] }], parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "204": { description: "Playlist deleted" } } },
    },
    "/playlists/{id}/songs": {
      post: { tags: ["Playlists"], summary: "Add a song to a playlist", security: [{ bearerAuth: [] }], parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Song added" } } },
    },
    "/playlists/{id}/songs/{songId}": {
      delete: { tags: ["Playlists"], summary: "Remove a song from a playlist", security: [{ bearerAuth: [] }], parameters: [{ $ref: "#/components/parameters/Id" }, { name: "songId", in: "path", required: true, schema: { type: "string" } }], responses: { "204": { description: "Song removed" } } },
    },
    "/favorites": {
      get: { tags: ["Favorites"], summary: "List favorite songs", security: [{ bearerAuth: [] }], responses: { "200": { description: "Favorite songs" } } },
    },
    "/favorites/check/{id}": {
      get: { tags: ["Favorites"], summary: "Check whether a song is favorited", security: [{ bearerAuth: [] }], parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "200": { description: "Favorite status" } } },
    },
    "/favorites/{id}": {
      post: { tags: ["Favorites"], summary: "Add a song to favorites", security: [{ bearerAuth: [] }], parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "201": { description: "Favorite added" } } },
      delete: { tags: ["Favorites"], summary: "Remove a song from favorites", security: [{ bearerAuth: [] }], parameters: [{ $ref: "#/components/parameters/Id" }], responses: { "204": { description: "Favorite removed" } } },
    },
  },
  tags: [
    { name: "Auth", description: "Authentication and session endpoints" },
    { name: "Users", description: "User profile endpoints" },
    { name: "Songs", description: "Song and streaming endpoints" },
    { name: "Artists", description: "Artist endpoints" },
    { name: "Playlists", description: "Playlist endpoints" },
    { name: "Favorites", description: "Favorite song endpoints" },
  ],
  components: {
    requestBodies: {
      Register: {
        description: "New user details",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/RegisterRequest" } } },
      },
      Login: {
        description: "Login credentials",
        required: true,
        content: { "application/json": { schema: { $ref: "#/components/schemas/LoginRequest" } } },
      },
    },
    parameters: {
      Id: { name: "id", in: "path", required: true, schema: { type: "string" } },
      Slug: { name: "slug", in: "path", required: true, schema: { type: "string" } },
    },
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
    schemas: {
      Error: {
        type: "object",
        properties: {
          message: { type: "string", example: "Invalid credentials" },
        },
        required: ["message"],
      },
      LoginRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", format: "password", example: "secret123" },
        },
      },
      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", example: "Alex Morgan" },
          email: { type: "string", format: "email", example: "user@example.com" },
          password: { type: "string", format: "password", minLength: 6, example: "secret123" },
        },
      },
      User: {
        type: "object",
        properties: {
          id: { type: "string", example: "cm123user" },
          name: { type: "string", example: "Alex Morgan" },
          email: { type: "string", format: "email", example: "user@example.com" },
          role: { type: "string", example: "USER" },
        },
      },
      AuthResponse: {
        type: "object",
        properties: {
          token: { type: "string", example: "eyJhbGciOiJIUzI1NiIs..." },
          user: { $ref: "#/components/schemas/User" },
        },
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  apis: ["./src/modules/**/*.routes.ts"],
});

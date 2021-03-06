var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

// Aggregation DB
var indexRouter = require("./routes/index");
var userRouter = require("./routes/user");
var roleRouter = require("./routes/role");
var permissionRouter = require("./routes/permission");
var invoiceRouter = require("./routes/invoice");
var invoicelineRouter = require("./routes/invoiceline");
var recommendationRouter = require("./routes/recommendation");
var playbackRouter = require('./routes/playback')
var mongoRouter = require("./routes/mongo");

// Original DB
var albumRouter = require("./routes/album");
var artistRouter = require("./routes/artist");
var genreRouter = require("./routes/genre");
var trackRouter = require("./routes/track");
var mediaTypeRouter = require("./routes/media-type");
var reportRouter = require("./routes/report");
var searchRouter = require('./routes/search');
var inactiveTrack = require('./routes/inactivate-songs');
var playlistRouter = require('./routes/playlist');

var app = express();




// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(cors());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  if (req.methods == "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use("/", indexRouter);

// Login

app.post("/login", userRouter.login);

// Search
app.post("/search/users", searchRouter.searchUser);
app.post("/search/tracks", searchRouter.searchTrack);
app.post("/search/albums", searchRouter.searchAlbum);
app.post("/search/artists", searchRouter.searchArtist);
app.post("/search/my-tracks", searchRouter.searchPurchasedTrack);
app.post("/search/available-tracks", searchRouter.searchAvailableTrack);
app.post("/search/logs", searchRouter.searchLog);

// Users
app.get("/users", userRouter.getUsers);
app.get("/users/:id", userRouter.getUserById);
app.get("/users/:id/permissions", userRouter.getPermissionsByUser);
app.get("/users/:id/role", userRouter.getRoleByUserId);
app.get("/users/:id/purchased-tracks", trackRouter.getPurchasedActiveTracksByUser);
app.get("/users/:id/available-tracks", trackRouter.getAvailableActiveTracksByUser);
app.post("/users", userRouter.createUser);
app.put("/users/:id", userRouter.updateUser);
app.delete("/users/:id", userRouter.deleteUser);


// Roles
app.get("/roles", roleRouter.getRoles);
app.get("/roles/:id", roleRouter.getRoleById);
app.get("/roles/:id/users", roleRouter.getUsersByRole);
app.get("/roles/:id/permissions", roleRouter.getPermissionsByRole);
app.post("/roles", roleRouter.createRole);
app.post("/roles/:id/permissions", roleRouter.createRolePermission);
app.put("/roles/:id", roleRouter.updateRole);
app.delete("/roles/:id", roleRouter.deleteRole);
app.delete("/roles/:id/permissions/:pid", roleRouter.deleteRolePermission);

// Permissions
app.get("/permissions", permissionRouter.getPermissions);
app.get("/permissions/:id", permissionRouter.getPermissionById);
app.post("/permissions", permissionRouter.createPermission);
app.put("/permissions/:id", permissionRouter.updatePermission);
app.delete("/permissions/:id", permissionRouter.deletePermission);

// Artist
app.get("/artists", artistRouter.getArtists);
app.get("/artists/:id", artistRouter.getArtistById);
app.post("/artists", artistRouter.createArtist);
app.put("/artists/:id", artistRouter.updateArtist);
app.delete("/artists/:id", artistRouter.deleteArtist);

// Album
app.get("/albums", albumRouter.getAlbums);
app.get("/albums/:id", albumRouter.getAlbumById);
app.post("/albums", albumRouter.createAlbum);
app.put("/albums/:id", albumRouter.updateAlbum);
app.delete("/albums/:id", albumRouter.deleteAlbum);

// Genre
app.get("/genres", genreRouter.getGenres);
app.get("/genres/:id", genreRouter.getGenreById);
app.post("/genres", genreRouter.createGenre);
app.put("/genres/:id", genreRouter.updateGenre);
app.delete("/genres/:id", genreRouter.deleteGenre);

// MediaType
app.get("/mediatypes", mediaTypeRouter.getMediaTypes);

// Track
app.get("/tracks", trackRouter.getTracks);
app.get("/tracks/active", trackRouter.getActiveTracks);
app.get("/tracks/:id", trackRouter.getTrackById);
app.get("/metadata/tracks", trackRouter.getTrackMetadata);
app.post("/tracks", trackRouter.createTrack);
app.put("/tracks/:id", trackRouter.updateTrack);
app.delete("/tracks/:id", trackRouter.deleteTrack);

//InactiveTrack
app.get("/inactivetrack", inactiveTrack.getInactiveSongs);
app.get("/inactivetrack/:id", inactiveTrack.getInactiveSongById);
app.post("/inactivetrack/:id", inactiveTrack.addInactiveSong);
app.delete("/inactivetrack/:id", inactiveTrack.deleteInactiveSong);

// Report
app.get("/reports/most-common-artists", reportRouter.getMostCommonArtists);
app.get("/reports/most-common-genres", reportRouter.getMostCommonGenres);
app.get("/reports/playlist-with-duration", reportRouter.getPlayListByDuration);
app.get("/reports/longest-songs", reportRouter.getLongestSongs);
app.get("/reports/most-track-register-user", reportRouter.getUsersWithMoreTracksRegister);
app.get("/reports/genre-duration-avg", reportRouter.getGenresDurationAvg);
app.get("/reports/artist-in-playlist", reportRouter.getArtistByPlayListCount);
app.get("/reports/most-genre-diversity-artist", reportRouter.getArtistWithMoreDiversityGenres);
app.get("/reports/logbook", reportRouter.getLogBook);
app.post("/reports/sales-per-week", reportRouter.getSalesPerWeek);
app.post("/reports/profitable-artists", reportRouter.getprofitableartists);
app.post("/reports/sales-per-genre", reportRouter.getSalesPerGenre);
app.post("/reports/playback-record-by-artist", reportRouter.getPlaybackRecordByArtist);


// Playlist
app.get("/playlists", playlistRouter.getPlaylists);
app.get("/playlists/:id", playlistRouter.getPlaylistById);
app.post("/playlists", playlistRouter.createPlaylist);
app.put("/playlists/:id", playlistRouter.updatePlaylist);
app.delete("/playlists/:id", playlistRouter.deletePlaylist);

// Invoice
app.post("/invoice", invoiceRouter.getInvoice);
app.get("/invoice/users-with-most-purchases", invoiceRouter.getUsersWithMorePurchasedSongs);
app.post("/invoice/new", cors(),invoiceRouter.createInvoice);

// InvoiceLine 
app.post("/invoiceline", invoicelineRouter.createInvoiceLine);
 
// Recommendations
app.post("/track-recommendations", recommendationRouter.getRecommendations)

// Playback Records
app.post("/playback", playbackRouter.createPlaybackRecord)

// Script
app.post("/mongo", mongoRouter.main);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

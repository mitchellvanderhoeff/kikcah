/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="definitions/kik.d.ts" />
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="firebaseAdapter.ts" />
var kikUser = null;
var games = [];

kik.getUser(function (user) {
   if (user) {
      kikUser = user;
      setup();
   }
});

function setup() {
   var userRef = firebase.createRef("/users/" + kikUser.username);

   // Lazy instantiate the user ref
   userRef.once('value', function (snapshot) {
      if (snapshot.val() == null) {
         userRef.set({
            "username": kikUser.username,
            "games": []
         });
      }
   });
   var gamesRef = firebase.createRef("/users/" + kikUser.username + "/games");
   gamesRef.on('child_added', function (snapshot) {
      var gameID = snapshot.val();
      firebase.createRef("/games/" + gameID).once('value', function (gameSnapshot) {
         var game = gameSnapshot.val();
         game.onSelected = function (event) {
         };
         games.push(game);
      });
   });
}

var GameList;
(function (GameList) {
   function generateGameCellForGame(game) {
      var gameCell = new Kinetic.Group();
      var border = new Kinetic;
      return gameCell;
   }

   function addGame(game) {
   }

   GameList.addGame = addGame;
})(GameList || (GameList = {}));
//# sourceMappingURL=main.js.map

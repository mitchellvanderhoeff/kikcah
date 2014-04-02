/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="definitions/kik.d.ts" />
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="firebaseAdapter.ts" />
/// <reference path="util.ts" />
var Main;
(function (Main) {
   var kikUser = null;
   var gameList;
   var stage;
   var mainLayer;
   var titleLayer;
   var gameListLayer;

   function main() {
      kik.getUser(function (user) {
         if (user) {
            kikUser = user;
            setup();
         }
      });
   }

   Main.main = main;

   function startNewGame() {
   }

   function openGame(game) {
   }

   Main.openGame = openGame;

   function setupGameList() {
      gameListLayer = new Kinetic.Layer({
         x: 0,
         y: titleLayer.width(),
         width: mainLayer.width(),
         height: mainLayer.height() - titleLayer.height()
      });
      gameList = new GameList(gameListLayer);
   }

   function setupGraphics() {
      stage = new Kinetic.Stage({
         container: 'container',
         width: window.innerWidth,
         height: window.innerHeight
      });

      mainLayer = new Kinetic.Layer({
         fill: 'black',
         width: stage.width(),
         height: stage.height()
      });

      titleLayer = new Kinetic.Layer({
         x: 0,
         y: 0,
         width: mainLayer.width(),
         height: 180
      });

      var buttonRect = Util.rectInset({
         x: 0,
         y: 60,
         width: stage.width(),
         height: 80
      }, {
         x: 30,
         y: 0
      });

      var newGameButton = new Kinetic.Group({
         x: buttonRect.x,
         y: buttonRect.y,
         width: buttonRect.width,
         height: buttonRect.height
      });

      newGameButton.add(new Kinetic.Rect({
         stroke: 'white',
         strokeWidth: 3,
         cornerRadius: 20,
         width: newGameButton.width(),
         height: newGameButton.height()
      }));

      newGameButton.add(new Kinetic.Text({
         fill: 'white',
         fontFamily: 'Arial',
         fontSize: 18,
         text: "New Game"
      }));

      newGameButton.on('click tap', function (event) {
         startNewGame();
      });

      titleLayer.add(newGameButton);

      var image = new Kinetic.Image({
         x: 0,
         y: 0
      });
      Util.loadKineticImage(image, '/resources/CAHlogo.png', function (imageData) {
         image.width(imageData.width);
         image.height(imageData.height);
         titleLayer.add(image);
      });

      mainLayer.add(titleLayer);

      stage.add(mainLayer);
   }

   function setupData() {
      var userRef = firebase.createRef("/users/" + kikUser.username);

      // Lazy instantiate the user ref
      userRef.getValueOnce(function (snapshot) {
         if (snapshot.val() == null) {
            userRef.set({
               "username": kikUser.username,
               "games": []
            });
         }
      });
      var gamesRef = firebase.createRef("/users/" + kikUser.username + "/games");
      gamesRef.onChildAdded(function (snapshot) {
         var gameID = snapshot.val();
         firebase.createRef("/games/" + gameID).getValueOnce(function (gameSnapshot) {
            var game = gameSnapshot.val();
            game.onSelected = function () {
               openGame(this);
            };
            gameList.addGame(game);
         });
      });
   }

   function setup() {
      setupGraphics();
      setupGameList();
      setupData();
   }
})(Main || (Main = {}));

var GameList = (function () {
   function GameList(layer) {
      this.games = [];
      this.cellHeight = 60;
      this.cellPadding = 10;
      this.layer = layer;
   }

   GameList.prototype.addCellForGame = function (game) {
      var buttonRect = {
         x: 0,
         y: this.games.length * (this.cellHeight + this.cellPadding),
         width: this.layer.width(),
         height: this.cellHeight
      };

      var gameItem = new Kinetic.Group({
         x: buttonRect.x,
         y: buttonRect.y,
         width: buttonRect.width,
         height: buttonRect.height
      });

      gameItem.add(new Kinetic.Rect({
         stroke: 'white',
         strokeWidth: 3,
         cornerRadius: 20,
         width: gameItem.width(),
         height: gameItem.height()
      }));

      // TODO: put some data in cell about game
      gameItem.on('click tap', function (event) {
         game.onSelected(event);
      });
   };

   GameList.prototype.addGame = function (game) {
      this.games.push(game);
   };
   return GameList;
})();

Main.main();
//# sourceMappingURL=main.js.map

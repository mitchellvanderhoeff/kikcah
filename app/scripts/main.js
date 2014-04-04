/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="definitions/kik.d.ts" />
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="firebaseAdapter.ts" />
/// <reference path="util.ts" />
/// <reference path="game.ts" />
/// <reference path="gameManager.ts" />
var Main = (function () {
   function Main(stage) {
      this.kikUser = null;
      this.stage = stage;
   }

   Main.prototype.main = function () {
      var _this = this;
      console.log("Starting main..");
      kik.getUser(function (user) {
         if (user) {
            _this.kikUser = user;
            _this.setup();
         } else {
            console.error("Could not get user info");
         }
      });
   };

   Main.prototype.startNewGame = function () {
      var newGame = {
         players: [this.kikUser.username],
         scores: [0],
         dateStarted: new Date().getTime(),
         currentBlackCardID: -1,
         currentGameMasterIndex: -1,
         winningScore: 8,
         onSelected: null
      };
      var newGameRef = this.gamesRef.push({});
      newGameRef.set(newGame);
      var gameID = newGameRef.name();
      this.userGamesRef.push(gameID);

      this.openGame(newGameRef);
   };

   Main.prototype.openGame = function (gameRef) {
      stage.destroyChildren();
      new GameManager(stage, gameRef).start();
   };

   Main.prototype.setupGameList = function () {
      this.gameListLayer = new Kinetic.Layer({
         x: 0,
         y: this.titleLayer.y() + this.titleLayer.height(),
         width: this.stage.width(),
         height: this.stage.height() - this.titleLayer.height()
      });
      this.gameListLayer.add(new Kinetic.Rect({
         fill: '#222',
         width: this.gameListLayer.width(),
         height: this.gameListLayer.height()
      }));
      this.gameList = new GameList(this.userGamesRef, this.gameListLayer, this.openGame);

      this.stage.add(this.gameListLayer);
      console.log("Game list setup finished");
   };

   Main.prototype.setupTitleLayer = function () {
      var _this = this;
      this.backgroundLayer = new Kinetic.Layer({
         width: this.stage.width(),
         height: this.stage.height()
      });

      this.backgroundLayer.add(new Kinetic.Rect({
         fill: 'black',
         width: this.backgroundLayer.width(),
         height: this.backgroundLayer.height()
      }));

      this.titleLayer = new Kinetic.Layer({
         x: 0,
         y: 0,
         width: this.stage.width(),
         height: 130
      });

      var titleText = new Kinetic.Text({
         x: 0,
         y: 5,
         width: this.titleLayer.width(),
         height: 40,
         fontSize: 30,
         fontFamily: 'Helvetica',
         fontStyle: 'bold',
         align: 'center',
         wrap: 'Word',
         fill: 'white',
         text: "Cards Against Humanity"
      });

      var buttonRect = Util.rectInset({
         x: 0,
         y: titleText.getY() + titleText.getHeight() + 10,
         width: this.titleLayer.width(),
         height: 50
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
         width: newGameButton.width(),
         height: newGameButton.height(),
         y: newGameButton.height() / 4,
         fill: 'white',
         fontFamily: 'Helvetica',
         fontStyle: 'bold',
         align: 'center',
         fontSize: 30,
         text: "New Game"
      }));

      Util.addDownstate(newGameButton);

      newGameButton.on('click tap', function (event) {
         _this.startNewGame();
      });

      this.titleLayer.add(titleText);
      this.titleLayer.add(newGameButton);

      this.stage.add(this.backgroundLayer);
      this.stage.add(this.titleLayer);

      console.log("Title setup finished");
   };

   Main.prototype.setupData = function () {
      var _this = this;
      var userRef = firebase.ref("/users/" + this.kikUser.username);

      // Lazy instantiate the user ref
      userRef.once('value', function (snapshot) {
         if (snapshot.val() == null) {
            userRef.set({
               "username": _this.kikUser.username,
               "games": []
            });
         }
      });
      this.userGamesRef = userRef.child('participatingGames');

      this.gamesRef = firebase.ref("/games/");
      console.log("Data setup finished");
   };

   Main.prototype.setup = function () {
      this.setupData();
      this.setupTitleLayer();
      this.setupGameList();
      console.log("App started");
   };
   return Main;
})();

var GameList = (function () {
   function GameList(userGamesRef, layer, openGame) {
      var _this = this;
      this.numGames = 0;
      this.userGamesRef = userGamesRef;
      this.layer = layer;

      userGamesRef.on('child_added', function (gameIDSnapshot) {
         var gameID = gameIDSnapshot.val();
         console.log("Adding game with ID " + gameID);
         var gameRef = firebase.ref("/games/" + gameID);
         gameRef.once('value', function (gameSnapshot) {
            var game = gameSnapshot.val();
            game.onSelected = function () {
               openGame(gameRef);
            };
            _this.addCellForGame(game);
         });
      });
   }

   GameList.prototype.addCellForGame = function (game) {
      var buttonRect = Util.rectInset({
         x: 0,
         y: this.numGames * (GameList.cellHeight + GameList.cellPadding),
         width: this.layer.width(),
         height: GameList.cellHeight
      }, {
         x: 4,
         y: 0
      });

      this.numGames += 1;

      var gameItem = new Kinetic.Group({
         x: buttonRect.x,
         y: buttonRect.y,
         width: buttonRect.width,
         height: buttonRect.height
      });

      gameItem.add(new Kinetic.Rect({
         x: 0,
         y: 0,
         width: buttonRect.width,
         height: buttonRect.height,
         stroke: 'white',
         strokeWidth: 3,
         cornerRadius: 5
      }));

      var textRect = Util.rectInset({
         x: 0,
         y: 0,
         width: gameItem.width(),
         height: gameItem.height()
      }, {
         x: 15,
         y: 10
      });

      var text = game.players.length + " Player" + (game.players.length != 1 ? 's' : '') + " - ";
      for (var index in game.players) {
         text += game.players[index];
         if (index < game.players.length - 1) {
            text += ", ";
         }
      }
      gameItem.add(new Kinetic.Text({
         x: textRect.x,
         y: textRect.y,
         width: textRect.width,
         height: textRect.height,
         fontFamily: 'Helvetica',
         fontStyle: 'bold',
         fontSize: 20,
         fill: 'white',
         text: text
      }));

      gameItem.on('click tap', function (event) {
         game.onSelected(event);
      });

      Util.addDownstate(gameItem);

      this.layer.add(gameItem);
      this.layer.draw();
   };
   GameList.cellHeight = 60;
   GameList.cellPadding = 5;
   return GameList;
})();

var stage = new Kinetic.Stage({
   container: 'container',
   width: window.innerWidth,
   height: window.innerHeight
});
new Main(stage).main();
//# sourceMappingURL=main.js.map

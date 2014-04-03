/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="definitions/kik.d.ts" />
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="firebaseAdapter.ts" />
/// <reference path="util.ts" />
/// <reference path="game.ts" />
/// <reference path="gameManager.ts" />

import KikUser = kik.KikUser;
import Rect = Util.Rect;

module Main {
    var kikUser: KikUser = null;
    var gameList: GameList;

    var gamesRef: Firebase;
    var userGamesRef: Firebase;

    var stage: Kinetic.Stage;
    var backgroundLayer: Kinetic.Layer;
    var titleLayer: Kinetic.Layer;
    var gameListLayer: Kinetic.Layer;

    export function main() {
        console.log("Starting app..");
        kik.getUser(user => {
            if (user) {
                kikUser = user;
                setup();
            } else {
                console.error("Could not get user info");
            }
        });
    }

    function startNewGame() {
        var newGame: Game = {
            players: [kikUser.username],
            scores: [0],
            dateStarted: new Date().getTime(),
            currentBlackCardID: -1,
            currentGameMasterIndex: -1,
            winningScore: 8,
            onSelected: null
        };
        var newGameRef = gamesRef.push({});
        newGameRef.set(newGame);
        userGamesRef.push(newGameRef.name());

        openGame(newGame);
    }

    export function openGame(game: Game) {
        stage.destroyChildren();
        new GameManager(stage, game).start();
    }

    function setupGameList() {
        gameListLayer = new Kinetic.Layer({
            x: 0,
            y: titleLayer.y() + titleLayer.height(),
            width: stage.width(),
            height: stage.height() - titleLayer.height()
        });
        gameListLayer.add(new Kinetic.Rect({
            fill: '#222',
            width: gameListLayer.width(),
            height: gameListLayer.height()
        }));
        gameList = new GameList(userGamesRef, gameListLayer);

        stage.add(gameListLayer);
        console.log("Game list setup finished");
    }

    function setupTitleLayer() {
        stage = new Kinetic.Stage({
            container: 'container',
            width: window.innerWidth,
            height: window.innerHeight
        });

        backgroundLayer = new Kinetic.Layer({
            width: stage.width(),
            height: stage.height()
        });

        backgroundLayer.add(new Kinetic.Rect({
            fill: 'black',
            width: backgroundLayer.width(),
            height: backgroundLayer.height()
        }));

        titleLayer = new Kinetic.Layer({
            x: 0,
            y: 0,
            width: stage.width(),
            height: 130
        });

        var titleText = new Kinetic.Text({
            x: 0,
            y: 5,
            width: titleLayer.width(),
            height: 40,
            fontSize: 30,
            fontFamily: 'Helvetica',
            fontStyle: 'bold',
            align: 'center',
            wrap: 'Word',
            fill: 'white',
            text: "Cards Against Humanity"
        });

        var buttonRect: Rect = Util.rectInset({
            x: 0,
            y: titleText.getY() + titleText.getHeight() + 10,
            width: titleLayer.width(),
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

        newGameButton.on('touchstart mousedown', function (event: Event) {
            this.getChildren().each(child => child.opacity(0.8));
            titleLayer.draw();
        });

        newGameButton.on('touchend mouseup mouseout', function (event: Event) {
            this.getChildren().each(child => child.opacity(1.0));
            titleLayer.draw();
        });

        newGameButton.on('click tap', (event: Event) => {
            startNewGame();
        });

        titleLayer.add(titleText);
        titleLayer.add(newGameButton);

        stage.add(backgroundLayer);
        stage.add(titleLayer);

        console.log("Title setup finished");
    }

    function setupData() {
        var userRef = firebase.ref("/users/" + kikUser.username);
        // Lazy instantiate the user ref
        userRef.once('value', snapshot => {
            if (snapshot.val() == null) {
                userRef.set({
                    "username": kikUser.username,
                    "games": []
                });
            }
        });
        userGamesRef = userRef.child('participatingGames');

        gamesRef = firebase.ref("/games/");
        console.log("Data setup finished");
    }

    function setup() {
        setupData();
        setupTitleLayer();
        setupGameList();
        console.log("App started");
    }
}

class GameList {
    public cellHeight: number = 60;
    public cellPadding: number = 10;

    private games: Array<Game>;
    private layer: Kinetic.Layer;
    private userGamesRef: Firebase;
    private numGames: number = 0;

    constructor(userGamesRef: Firebase, layer: Kinetic.Layer) {
        this.userGamesRef = userGamesRef;
        this.layer = layer;
        this.games = [];

        userGamesRef.on('child_added', gameIDSnapshot => {
            var gameID = gameIDSnapshot.val();
            console.log("Adding game with ID " + gameID);
            firebase.ref("/games/" + gameID)
                .once('value', gameSnapshot => {
                    var game: Game = gameSnapshot.val();
                    game.onSelected = function () {
                        Main.openGame(this);
                    };
                    this.games.push(game);
                    this.addCellForGame(game);
                });
        });
    }

    private addCellForGame(game: Game) {
        var buttonRect = {
            x: 0,
            y: this.numGames * (this.cellHeight + this.cellPadding),
            width: this.layer.width(),
            height: this.cellHeight
        };

        console.log("Adding game cell with rect " + JSON.stringify(buttonRect));

        this.numGames += 1;

        var gameItem = new Kinetic.Group({
            x: buttonRect.x,
            y: buttonRect.y,
            width: buttonRect.width,
            height: buttonRect.height
        });

        gameItem.add(new Kinetic.Rect({
            x: buttonRect.x,
            y: buttonRect.y,
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
                text += ", "
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

        gameItem.on('click tap', (event: Event) => {
            game.onSelected(event);
        });

        this.layer.add(gameItem);
        this.layer.draw();
    }
}

Main.main();
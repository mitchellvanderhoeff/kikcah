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

class Main {
    private kikUser: KikUser = null;
    private gameList: GameList;

    private gamesRef: Firebase;
    private userGamesRef: Firebase;

    private stage: Kinetic.Stage;
    private backgroundLayer: Kinetic.Layer;
    private titleLayer: Kinetic.Layer;
    private gameListLayer: Kinetic.Layer;

    constructor(stage: Kinetic.Stage) {
        this.stage = stage;
    }

    public main() {
        console.log("Starting main..");
        kik.getUser(user => {
            if (user) {
                this.kikUser = user;
                this.setup();
            } else {
                console.error("Could not get user info");
            }
        });
    }

    private startNewGame() {
        var newGame: Game = {
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
    }

    public openGame(gameRef: Firebase) {
        stage.destroyChildren();
        new GameManager(stage, gameRef).start();
    }

    private setupGameList() {
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
    }

    private setupTitleLayer() {
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

        var buttonRect: Rect = Util.rectInset({
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

        newGameButton.on('click tap', (event: Event) => {
            this.startNewGame();
        });

        this.titleLayer.add(titleText);
        this.titleLayer.add(newGameButton);

        this.stage.add(this.backgroundLayer);
        this.stage.add(this.titleLayer);

        console.log("Title setup finished");
    }

    private setupData() {
        var userRef = firebase.ref("/users/" + this.kikUser.username);
        // Lazy instantiate the user ref
        userRef.once('value', snapshot => {
            if (snapshot.val() == null) {
                userRef.set({
                    "username": this.kikUser.username,
                    "games": []
                });
            }
        });
        this.userGamesRef = userRef.child('participatingGames');

        this.gamesRef = firebase.ref("/games/");
        console.log("Data setup finished");
    }

    private setup() {
        this.setupData();
        this.setupTitleLayer();
        this.setupGameList();
        console.log("App started");
    }
}

class GameList {
    public static cellHeight: number = 60;
    public static cellPadding: number = 5;

    private layer: Kinetic.Layer;
    private userGamesRef: Firebase;
    private numGames: number = 0;

    constructor(userGamesRef: Firebase, layer: Kinetic.Layer, openGame: (gameRef: Firebase) => void) {
        this.userGamesRef = userGamesRef;
        this.layer = layer;

        userGamesRef.on('child_added', gameIDSnapshot => {
            var gameID = gameIDSnapshot.val();
            console.log("Adding game with ID " + gameID);
            var gameRef = firebase.ref("/games/" + gameID);
            gameRef
                .once('value', gameSnapshot => {
                    var game: Game = gameSnapshot.val();
                    game.onSelected = function () {
                        openGame(gameRef);
                    };
                    this.addCellForGame(game);
                });
        });
    }

    private addCellForGame(game: Game) {
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

        Util.addDownstate(gameItem);

        this.layer.add(gameItem);
        this.layer.draw();
    }
}

var stage = new Kinetic.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});
new Main(stage).main();
/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="definitions/kik.d.ts" />
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="firebaseAdapter.ts" />
/// <reference path="util.ts" />

import KikUser = kik.KikUser;
import Rect = Util.Rect;

interface Game {
    // Corresponds
    players: Array<string>;
    scores: Array<number>;

    dateStarted: Date;
    currentBlackCardID: number;
    currentGameMasterIndex: number;
    winningScore: number;

    onSelected: (event: Event) => void;
}

module Main {
    var kikUser: KikUser = null;
    var gameList: GameList;
    var stage: Kinetic.Stage;
    var mainLayer: Kinetic.Layer;
    var titleLayer: Kinetic.Layer;
    var gameListLayer: Kinetic.Layer;

    export function main() {
        kik.getUser(user => {
            if (user) {
                kikUser = user;
                setup();
            }
        });
    }

    function startNewGame() {

    }

    export function openGame(game: Game) {

    }

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

        var buttonRect: Rect = Util.rectInset({
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

        newGameButton.on('click tap', (event: Event) => {
            startNewGame();
        });

        titleLayer.add(newGameButton);

        var image = new Kinetic.Image({
            x: 0,
            y: 0
        });
        Util.loadKineticImage(image, '/resources/CAHlogo.png', (imageData: HTMLImageElement) => {
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
        userRef.getValueOnce(snapshot => {
            if (snapshot.val() == null) {
                userRef.set({
                    "username": kikUser.username,
                    "games": []
                });
            }
        });
        var gamesRef = firebase.createRef("/users/" + kikUser.username + "/games");
        gamesRef.onChildAdded(snapshot => {
            var gameID = snapshot.val();
            firebase.createRef("/games/" + gameID)
                .getValueOnce(gameSnapshot => {
                    var game: Game = gameSnapshot.val(); // Should fill in the fields if they exist
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
}

class GameList {
    public layer: Kinetic.Layer;
    private games: Array<Game> = [];
    public cellHeight: number = 60;
    public cellPadding: number = 10;

    constructor(layer: Kinetic.Layer) {
        this.layer = layer;
    }

    private addCellForGame(game: Game) {
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

        gameItem.on('click tap', (event: Event) => {
            game.onSelected(event);
        });
    }

    public addGame(game: Game) {
        this.games.push(game);
    }
}

Main.main();
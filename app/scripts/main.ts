/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="definitions/kik.d.ts" />
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="firebaseAdapter.ts" />

import KikUser = kik.KikUser;

var kikUser: KikUser = null;
var games: Array<Game> = [];

interface Game {
    // Corresponds
    players: Array<string>;
    scores: Array<number>;

    dateStarted: Date;
    currentBlackCardID: number;
    currentGameMasterIndex: number;
    winningScore: number;

    onSelected: (event: Event) => void
}

kik.getUser(user => {
    if (user) {
        kikUser = user;
        setup();
    }
});

function setup() {
    var userRef = firebase.createRef("/users/" + kikUser.username);
    // Lazy instantiate the user ref
    userRef.once('value', snapshot => {
        if (snapshot.val() == null) {
            userRef.set({
                "username": kikUser.username,
                "games": []
            });
        }
    });
    var gamesRef = firebase.createRef("/users/" + kikUser.username + "/games");
    gamesRef.on('child_added', snapshot => {
        var gameID = snapshot.val();
        firebase.createRef("/games/" + gameID)
            .once('value', gameSnapshot => {
                var game: Game = gameSnapshot.val(); // Should fill in the fields if they exist
                game.onSelected = (event: Event) => {

                };
                games.push(game);
            });
    });
}

module GameList {
    function generateGameCellForGame(game: Game, width: number =): Kinetic.Group {
        var gameCell = new Kinetic.Group();
        var border = new Kinetic.Rect({

        });
        return gameCell;
    }

    export function addGame(game: Game) {

    }
}
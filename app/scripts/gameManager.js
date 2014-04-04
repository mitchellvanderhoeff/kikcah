/**
* Created by mitch on 2014-04-02.
*/
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="cardManager.ts" />
/// <reference path="game.ts" />
/// <reference path="definitions/firebase.d.ts" />
/// <reference path="main.ts" />
var Card = CardManager.Card;

var GameManager = (function () {
    function GameManager(stage, gameRef, kikUser) {
        var _this = this;
        this.stage = stage;
        this.gameRef = gameRef;
        this.kikUser = kikUser;
        this.players = [];
        this.whiteCards = [];
        this.playersRef = gameRef.child('players');
        this.playersRef.on('child_added', function (snapshot) {
            var player = snapshot.val();
            if (!_this.myPlayerRef && player['username'] == _this.kikUser.username) {
                _this.myPlayerRef = snapshot.ref();
                _this.whiteCardsRef = _this.myPlayerRef.child('whiteCards');
            }
            _this.players.push(player);
        });
        this.setupGraphics();
    }
    GameManager.makeBack = function () {
        var view = new Kinetic.Group();
        view.add(Util.makeText({
            fill: 'white',
            fontSize: 20,
            text: "Back"
        }));
        return view;
    };

    GameManager.makeInvite = function () {
        var view = new Kinetic.Group();
        view.add(Util.makeText({
            fill: 'white',
            fontSize: 20,
            text: "Invite"
        }));
        return view;
    };

    GameManager.prototype.inviteButtonClicked = function (event) {
        var _this = this;
        kik.pickUsers({
            minResults: 1,
            maxResults: 1
        }, function (users) {
            if (users && users[0]) {
                var user = users[0];
                _this.playersRef.push({
                    username: user.username,
                    score: 0
                });
                var userRef = firebase.ref("/users/" + user.username);
                userRef.once('value', function (snapshot) {
                    if (snapshot.val() == null) {
                        userRef.set({
                            "username": user.username,
                            "participatingGames": []
                        });
                    }
                    userRef.child('participatingGames').push(_this.gameRef.name());
                });
                kik.send(user.username, {
                    title: "Cards Against Humanity",
                    text: _this.kikUser.username + " has invited you to play Cards Against Humanity!"
                });
            }
        });
    };

    GameManager.prototype.setupGraphics = function () {
        var _this = this;
        this.bgLayer = new Kinetic.Layer({
            width: this.stage.width(),
            height: this.stage.height()
        });

        this.bgLayer.add(new Kinetic.Rect({
            width: this.bgLayer.width(),
            height: this.bgLayer.height(),
            fill: 'white'
        }));

        this.topBarLayer = new Kinetic.Layer({
            width: this.stage.width(),
            height: GameManager.topBarHeight
        });

        var back = GameManager.makeBack();
        back.width(60);
        back.position({ x: 7, y: this.topBarLayer.height() / 3 });
        back.on('click tap', function (event) {
            _this.stage.destroyChildren();
            new Main(_this.stage).main();
        });
        Util.addDownstate(back);

        var invite = GameManager.makeInvite();
        invite.width(55);
        invite.position({ x: this.topBarLayer.width() - invite.width() - 7, y: this.topBarLayer.height() / 3 });
        invite.on('click tap', function (event) {
            _this.inviteButtonClicked(event);
        });
        Util.addDownstate(invite);

        this.topBarLayer.add(new Kinetic.Rect({
            width: this.topBarLayer.width(),
            height: this.topBarLayer.height(),
            fill: 'black'
        }));
        this.topBarLayer.add(back);
        this.topBarLayer.add(invite);

        this.gameLayer = new Kinetic.Layer({
            width: this.stage.width(),
            height: this.stage.height() - this.topBarLayer.height(),
            y: this.topBarLayer.height()
        });

        this.stage.add(this.bgLayer);
        this.stage.add(this.topBarLayer);
        this.stage.add(this.gameLayer);
    };

    GameManager.prototype.start = function () {
        var _this = this;
        // todo: custom cards
        var addingCards = false;
        this.whiteCardsRef.on('value', function (snapshot) {
            if (addingCards) {
                return;
            }
            var numCardsInHand = snapshot.numChildren();
            var numCardsToAdd = GameManager.requiredNumWhiteCards - numCardsInHand;
            if (numCardsToAdd > 0) {
                addingCards = true;
                _this.gameRef.child('whiteDeck').limit(numCardsToAdd).once('child_added', function (cardSnapshot) {
                    numCardsToAdd -= 1;
                    if (numCardsToAdd == 0) {
                        addingCards = false;
                    }
                    var cardText = cardSnapshot.val();
                    _this.whiteCardsRef.push(cardText);
                    _this.whiteCards.push(cardText);
                    cardSnapshot.ref().remove();
                });
            } else {
            }
        });

        this.gameRef.child('currentGameMasterIndex').on('value', function (snapshot) {
            var gameMaster = _this.players[snapshot.val()];
            if (gameMaster['username'] == _this.kikUser.username) {
            } else {
            }
        });
    };

    GameManager.prototype.calculateFanPosition = function (coefficient) {
        var offsetFromBottom = -650.0;
        var cardFanRadius = 700.0;
        var angleOffsetCoefficient = 0.455;
        var angleStart = Math.PI * (1 - angleOffsetCoefficient);
        var angleEnd = Math.PI * angleOffsetCoefficient;
        var angleRadians = angleStart + (coefficient * (angleEnd - angleStart));
        var angleDegrees = (angleRadians * (180 / Math.PI));
        return {
            x: this.stage.width() / 2 + cardFanRadius * Math.cos(angleRadians),
            y: this.stage.height() - cardFanRadius * Math.sin(angleRadians) - offsetFromBottom,
            rotation: 90 - angleDegrees
        };
    };

    GameManager.prototype.dealOwnHand = function (layer, numCards) {
        if (typeof numCards === "undefined") { numCards = 8; }
        var cards = [];
        for (var i = 0; i < numCards; i++) {
            var card = null;
            var coefficient = ((i + 0.5) / numCards);
            var fanPosition = this.calculateFanPosition(coefficient);
            card.view.setX(fanPosition.x);
            card.view.setY(fanPosition.y);
            card.view.rotate(fanPosition.rotation);
            layer.add(card.view);

            var magnificationFactor = 1.3;
            var magnifyTween = new Kinetic.Tween({
                node: card.view,
                scaleX: magnificationFactor,
                scaleY: magnificationFactor,
                y: card.view.getY() - 70,
                easing: Kinetic.Easings.EaseInOut,
                duration: 0.1
            });
            card.selectionTween = magnifyTween;

            cards.push(card);
        }
        for (var i = 0; i < numCards; i++) {
            var view = cards[i].view;
            view.setZIndex(i);
        }
        return cards;
    };
    GameManager.topBarHeight = 55;
    GameManager.requiredNumWhiteCards = 8;
    return GameManager;
})();
//# sourceMappingURL=gameManager.js.map

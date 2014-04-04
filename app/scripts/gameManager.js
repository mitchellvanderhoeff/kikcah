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
       this.setupGraphics();
       this.blackCardRef = gameRef.child('currentBlackCard');
        this.playersRef = gameRef.child('players');
        this.playersRef.on('child_added', function (snapshot) {
            var player = snapshot.val();
           _this.players.push(player);
           var playerName = player['username'];
           if (!_this.myPlayerRef && playerName == _this.kikUser.username) {
                _this.myPlayerRef = snapshot.ref();
                _this.whiteCardsRef = _this.myPlayerRef.child('whiteCards');
              _this.start();
            }
        });
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
           height: this.stage.height() - this.topBarLayer.height() - this.topBarLayer.x(),
           x: 0,
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

               // todo: what if no cards left in white deck?
                _this.gameRef.child('whiteDeck').limit(numCardsToAdd).once('child_added', function (cardSnapshot) {
                    numCardsToAdd -= 1;
                    if (numCardsToAdd == 0) {
                        addingCards = false;
                    }
                    var cardText = cardSnapshot.val();
                    _this.whiteCardsRef.push(cardText);
                    cardSnapshot.ref().remove();
                });
            } else {
               _this.whiteCards = _.values(snapshot.val()); // extract cards from node
               _this.renderWhiteCards();
            }
        });

       this.blackCardRef.on('value', function (snapshot) {
          _this.blackCard = snapshot.val();
          _this.renderBlackCard();
       });

        this.gameRef.child('currentGameMasterIndex').on('value', function (snapshot) {
           var gameMaster = _this.players[snapshot.val() || 0];
            if (gameMaster['username'] == _this.kikUser.username) {
            } else {
            }
        });
    };

    GameManager.prototype.calculateFanPosition = function (coefficient) {
       var offsetFromBottom = -630.0;
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

   GameManager.prototype.renderWhiteCards = function () {
      var _this = this;
        var cards = [];
      this.selectedCard = null;
      this.whiteCards.forEach(function (whiteCard) {
         var card = new Card(whiteCard, 'white');
         cards.push(card);
         var coefficient = ((cards.length - 0.5) / GameManager.requiredNumWhiteCards);
         var fanPosition = _this.calculateFanPosition(coefficient);
            card.view.setX(fanPosition.x);
            card.view.setY(fanPosition.y);
            card.view.rotate(fanPosition.rotation);
         card.view.on('click tap', function () {
            if (card.selected) {
            } else {
               if (_this.selectedCard) {
                  _this.selectedCard.setSelected(false);
               }
               card.setSelected(true);
               _this.selectedCard = card;
            }
         });
         card.onSelect = function () {
         };
         _this.gameLayer.add(card.view);

            var magnificationFactor = 1.3;

         var magnifyTween = new Kinetic.Tween({
                node: card.view,
                scaleX: magnificationFactor,
                scaleY: magnificationFactor,
            y: card.view.getY() - 100,
                easing: Kinetic.Easings.EaseInOut,
                duration: 0.1
            });

         card.selectionTween = magnifyTween;
      });
   };

   GameManager.prototype.renderBlackCard = function () {
      var card = new Card(this.blackCard, 'black');
      this.gameLayer.add(card.view);
      card.view.position({
         x: 70,
         y: 130
      });
    };
    GameManager.topBarHeight = 55;
    GameManager.requiredNumWhiteCards = 8;
    return GameManager;
})();
//# sourceMappingURL=gameManager.js.map

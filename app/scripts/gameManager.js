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
       this.whiteCardsMap = {};
       this.isGameMaster = false;
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

       var backgroundRect = new Kinetic.Rect({
          x: 0,
          y: 0,
          width: this.gameLayer.width(),
          height: this.gameLayer.height()
       });
       backgroundRect.on('click tap', function () {
          if (_this.selectedCard) {
             _this.selectedCard.setSelected(false);
             _this.selectedCard = null;
          }
       });
       this.gameLayer.add(backgroundRect);

        this.stage.add(this.bgLayer);
        this.stage.add(this.topBarLayer);
        this.stage.add(this.gameLayer);
    };

    GameManager.prototype.start = function () {
        // todo: custom cards
       var _this = this;
       this.whiteCardsRef.once('value', function (snapshot) {
          var numCardsToAdd = GameManager.requiredNumWhiteCards - snapshot.numChildren();
          if (numCardsToAdd <= 0) {
                return;
            }
          var refsToRemove = [];
          var deckRef = _this.gameRef.child('whiteDeck');
          console.log("Adding " + numCardsToAdd + " cards");
          deckRef.startAt().limit(numCardsToAdd).once('value', function (snapshot) {
             snapshot.forEach(function (snapshot) {
                var cardText = snapshot.val();
                console.log("adding '" + cardText + "'");
                _this.whiteCardsRef.push(cardText);
                refsToRemove.push(snapshot.ref());
                return false;
             });

             refsToRemove.forEach(function (ref) {
                return ref.remove();
             });
          });
       });

       this.whiteCardsRef.on('child_added', function (snapshot) {
          var cardText = snapshot.val();
          var card = new Card(cardText, 'white');
          _this.whiteCardsMap[snapshot.name()] = card;
          _this.renderWhiteCards();
       });

       this.whiteCardsRef.on('child_removed', function (snapshot) {
          delete _this.whiteCardsMap[snapshot.name()];
          var deckRef = _this.gameRef.child('whiteDeck');
          deckRef.limit(1).once('value', function (snapshot) {
             snapshot.forEach(function (snapshot) {
                var cardText = snapshot.val();
                if (cardText) {
                   console.log("adding '" + cardText + "' after removal");
                   _this.whiteCardsRef.push(cardText);
                   snapshot.ref().remove();
                    }
                return false;
                });
          });
       });

       this.blackCardRef.on('value', function (snapshot) {
          _this.blackCard = snapshot.val();
          if (!_this.blackCard) {
             _this.gameRef.child('blackDeck').limit(1).once('child_added', function (snapshot) {
                snapshot.ref().remove();
                _this.blackCardRef.set(snapshot.val());
                _this.renderBlackCard();
             });
             return;
            }
          _this.renderBlackCard();
        });

        this.gameRef.child('currentGameMasterIndex').on('value', function (snapshot) {
           var gameMaster = _this.players[snapshot.val() || 0];
           _this.isGameMaster = (gameMaster['username'] == _this.kikUser.username);
        });

       this.gameRef.child('submittedWhiteCards').on('value', function (snapshot) {
          var numSubmitted = snapshot.numChildren();
          _this.submittedCardText.text(numSubmitted + " submitted");
          _this.gameLayer.draw();
          if (_this.isGameMaster && numSubmitted == _this.players.length - 1) {
             // todo: display cards to choose from for the game master
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
      var numCards = _.size(this.whiteCardsMap);
      this.selectedCard = null;
      this.cardsGroup = new Kinetic.Group();
      for (var whiteCardID in this.whiteCardsMap) {
         var card = this.whiteCardsMap[whiteCardID];
         var coefficient = ((numCards - 0.5) / GameManager.requiredNumWhiteCards);
         var fanPosition = this.calculateFanPosition(coefficient);
            card.view.setX(fanPosition.x);
            card.view.setY(fanPosition.y);
            card.view.rotate(fanPosition.rotation);

         card.view['model'] = card;
         card['gameManager'] = this;
         card['cardID'] = whiteCardID;

         card.view.on('click tap', function () {
            var card = this['model'];
            var gameManager = card['gameManager'];
            if (card.selected) {
               gameManager.whiteCardsRef.child(card['cardID']).remove();
               gameManager.gameRef.child('submittedWhiteCards').child(gameManager.kikUser.username).push(card.text);
               this.destroy(); // destroy view
               gameManager.gameLayer.draw();
            } else {
               if (gameManager.selectedCard) {
                  gameManager.selectedCard.setSelected(false);
               }
               card.setSelected(true);
               gameManager.selectedCard = card;
            }
         });
         this.cardsGroup.add(card.view);
         card.view.moveToTop();

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
      }
      this.gameLayer.add(this.cardsGroup);
      this.gameLayer.draw();
   };

   GameManager.prototype.renderBlackCard = function () {
      var blackCard = new Card(this.blackCard, 'black');
      this.gameLayer.add(blackCard.view);
      blackCard.view.position({
         x: 70,
         y: 130
      });
      var submittedCardView = new Card("", 'white').view;
      this.submittedCardText = Util.makeText({
         fill: 'black',
         fontSize: 16,
         align: 'center',
         width: submittedCardView.width(),
         x: 0,
         y: submittedCardView.height() / 2,
         text: "0 submitted"
      });
      submittedCardView.position({
         x: blackCard.view.x() + 120,
         y: blackCard.view.y()
      });
      submittedCardView.add(this.submittedCardText);
      this.gameLayer.add(submittedCardView);
      this.submittedCardText.moveToTop();
      blackCard.view.moveToBottom();
      submittedCardView.moveToBottom();
      this.gameLayer.draw();
    };
    GameManager.topBarHeight = 55;
    GameManager.requiredNumWhiteCards = 8;
    return GameManager;
})();
//# sourceMappingURL=gameManager.js.map

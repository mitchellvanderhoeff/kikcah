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
   function GameManager(stage, gameRef) {
      this.stage = stage;
      this.gameRef = gameRef;
      this.playersRef = gameRef.child('players');
      this.scoresRef = gameRef.child('scores');
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
            _this.playersRef.push(user.username);
            _this.scoresRef.push(0);
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
      invite.on('click tap', this.inviteButtonClicked);
      Util.addDownstate(invite);

      this.topBarLayer.add(new Kinetic.Rect({
         width: this.topBarLayer.width(),
         height: this.topBarLayer.height(),
         fill: 'black'
      }));
      this.topBarLayer.add(back);
      this.topBarLayer.add(invite);

      this.stage.add(this.bgLayer);
      this.stage.add(this.topBarLayer);
   };

   GameManager.prototype.start = function () {
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
      if (typeof numCards === "undefined") {
         numCards = 8;
      }
      var cards = [];
      for (var i = 0; i < numCards; i++) {
         var card = CardManager.dealWhiteCard();
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
   GameManager.topBarHeight = 40;
   return GameManager;
})();
//# sourceMappingURL=gameManager.js.map

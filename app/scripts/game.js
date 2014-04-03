/**
 * Created by mitch on 2014-04-02.
 */
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="cardManager.ts" />
var Card = CardManager.Card;
var stage;

function calculateFanPosition(coefficient) {
   var offsetFromBottom = -650.0;
   var cardFanRadius = 700.0;
   var angleOffsetCoefficient = 0.455;
   var angleStart = Math.PI * (1 - angleOffsetCoefficient);
   var angleEnd = Math.PI * angleOffsetCoefficient;
   var angleRadians = angleStart + (coefficient * (angleEnd - angleStart));
   var angleDegrees = (angleRadians * (180 / Math.PI));
   return {
      x: stage.width() / 2 + cardFanRadius * Math.cos(angleRadians),
      y: stage.height() - cardFanRadius * Math.sin(angleRadians) - offsetFromBottom,
      rotation: 90 - angleDegrees
   };
}

function dealOwnHand(layer, numCards) {
   if (typeof numCards === "undefined") {
      numCards = 8;
   }
   var cards = [];
   for (var i = 0; i < numCards; i++) {
      var card = CardManager.dealWhiteCard();
      var coefficient = ((i + 0.5) / numCards);
      var fanPosition = calculateFanPosition(coefficient);
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
}
//# sourceMappingURL=game.js.map

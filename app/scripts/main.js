/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="cardManager.ts" />
var cardsTopYBound = 300;

function generateSomeCards(cardsData) {
   for (var i = 0; i < 8; i++) {
      var cardText = cardsData[i]['text'];
      var card = CardManager.createCard(cardText, CardManager.CardType.white);
      card.setX(stage.width() * (i / 8));
      card.setY(cardsTopYBound);
      card.dragBoundFunc(function (position) {
         var x = position.x, y = position.y;
         if (position.x < 0) {
            x = 0;
         }
         if (position.y < cardsTopYBound) {
            y = cardsTopYBound;
         }
         var cardsBottomYBound = stage.height() - card.height();
         if (position.y > cardsBottomYBound) {
            y = cardsBottomYBound;
         }
         var cardsRightXBound = stage.width() - card.width();
         if (position.x > cardsRightXBound) {
            x = cardsRightXBound;
         }
         return {
            x: x,
            y: y
         };
      });
      card.on('click', function (event) {
         card.moveToTop();
      });
      cardLayer.add(card);
   }
}

var stage = new Kinetic.Stage({
   container: 'container',
   width: window.innerWidth,
   height: window.innerHeight
});

var cardCollection = [];
Util.getJSON("/resources/cards.json", function (json) {
   var parsed = JSON.parse(json);
   for (var card in parsed) {
      if (card['expansion'] == "Base") {
         cardCollection.push(card);
      }
   }
   generateSomeCards(cardCollection);
});

var cardLayer = new Kinetic.Layer();

var bgLayer = new Kinetic.Layer();

bgLayer.add(new Kinetic.Rect({
   width: stage.width(),
   height: stage.height(),
   fill: '#EEEEEE'
}));

stage.add(bgLayer);
stage.add(cardLayer);
//# sourceMappingURL=main.js.map

/**
 * Created by mitch on 2014-03-31.
 */
/// <reference path="kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="cardManager.ts" />

import Card = CardManager.Card;
function generateSomeCards(layer, numCards: number = 8) {
    for (var i = 0; i < numCards; i++) {
        var card: Card = CardManager.dealWhiteCard();
        var cardView = card.view;
        cardView.setX(stage.width() * (i / numCards));
        cardView.setY(300);
        layer.add(cardView);

        var magnificationFactor = 1.3;
        var magnifyTween = new Kinetic.Tween({
            node: cardView,
            scaleX: magnificationFactor,
            scaleY: magnificationFactor,
            easing: Kinetic.Easings.EaseInOut,
            duration: 0.1
        });
        cardView['magnifyTween'] = magnifyTween;

        cardView.on('mouseover touchstart', function () {
            this.moveToTop();
            this.magnifyTween.play();
        });

        cardView.on('mouseout touchmove', function () {
            this.magnifyTween.reverse();
        });

        cardView.on('click touchend', function () {
            this['model'].onSelect();
        });
    }
}

var stage = new Kinetic.Stage({
    container: 'container',
    width: window.innerWidth,
    height: window.innerHeight
});

var cardLayer = new Kinetic.Layer();
var bgLayer = new Kinetic.Layer();

CardManager.populateCardData(() => {
    CardManager.shuffleCards();
    generateSomeCards(cardLayer, 8);
});

bgLayer.add(new Kinetic.Rect({
    width: stage.width(),
    height: stage.height(),
    fill: '#EEEEEE'
}));

stage.add(bgLayer);
stage.add(cardLayer);
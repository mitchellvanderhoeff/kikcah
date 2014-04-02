/**
 * Created by mitch on 2014-04-02.
 */
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="cardManager.ts" />

import Card = CardManager.Card;

function calculateFanPosition(coefficient: number): { x: number; y: number; rotation: number } {
    var offsetFromBottom: number = -650.0;
    var cardFanRadius: number = 700.0;
    var angleOffsetCoefficient = 0.455;
    var angleStart = Math.PI * (1 - angleOffsetCoefficient);
    var angleEnd = Math.PI * angleOffsetCoefficient;
    var angleRadians: number = angleStart + (coefficient * (angleEnd - angleStart));
    var angleDegrees: number = (angleRadians * (180 / Math.PI));
    return {
        x: stage.width() / 2 + cardFanRadius * Math.cos(angleRadians),
        y: stage.height() - cardFanRadius * Math.sin(angleRadians) - offsetFromBottom,
        rotation: 90 - angleDegrees
    }
}

function dealOwnHand(layer: Kinetic.Layer, numCards: number = 8): Array<Card> {
    var cards: Array<Card> = [];
    for (var i = 0; i < numCards; i++) {
        var card: Card = CardManager.dealWhiteCard();
        var coefficient: number = ((i + 0.5) / numCards);
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
        var view: Kinetic.Group = cards[i].view;
        view.setZIndex(i);
    }
    return cards;
}

function dealBlackCard(layer: Kinetic.Layer): Card {
    var card = CardManager.dealBlackCard();
    card.view.offset({x: 0, y: 0});
    card.view.setX(20);
    card.view.setY(20);
    layer.add(card.view);
    return card;
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
    dealOwnHand(cardLayer);
    dealBlackCard(cardLayer);
    cardLayer.draw();
});

bgLayer.add(new Kinetic.Rect({
    width: stage.width(),
    height: stage.height(),
    fill: '#F6F6F6'
}));

stage.add(bgLayer);
stage.add(cardLayer);
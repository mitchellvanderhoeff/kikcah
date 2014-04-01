/**
* Created by mitch on 2014-03-31.
*/
/// <reference path="kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="cardManager.ts" />
var Card = CardManager.Card;
function generateOwnHand(layer, numCards) {
    if (typeof numCards === "undefined") { numCards = 8; }
    for (var i = 0; i < numCards; i++) {
        var card = CardManager.dealWhiteCard();
        var cardView = card.view;
        var coefficient = ((i + 0.5) / numCards);
        var offsetFromBottom = -650.0;
        var cardFanRadius = 700.0;
        var angleOffsetCoefficient = 0.44;
        var angleStart = Math.PI * (1 - angleOffsetCoefficient);
        var angleEnd = Math.PI * angleOffsetCoefficient;
        var angleRadians = angleStart + (coefficient * (angleEnd - angleStart));
        var angleDegrees = (angleRadians * (180 / Math.PI));
        cardView.setX(stage.width() / 2 + cardFanRadius * Math.cos(angleRadians));
        cardView.setY(stage.height() - cardFanRadius * Math.sin(angleRadians) - offsetFromBottom);
        cardView.rotate(90 - angleDegrees);
        layer.add(cardView);
        var indicatorCircle = new Kinetic.Circle({
            x: stage.width() / 2,
            y: stage.height() - offsetFromBottom,
            radius: cardFanRadius,
            stroke: 'black',
            fillAlpha: 0.0
        });
        var center = new Kinetic.Circle({
            x: stage.width() / 2,
            y: stage.height() - offsetFromBottom,
            radius: 5,
            fill: 'black'
        });
        layer.add(indicatorCircle);
        layer.add(center);

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
            this.border.stroke('#D5D5F5');
        });

        cardView.on('mouseout touchend', function () {
            this.moveToBottom();
            this.magnifyTween.reverse();
            this.border.stroke('#E5E5E5');
        });

        cardView.on('touchmove mousemove', function (event) {
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

CardManager.populateCardData(function () {
    CardManager.shuffleCards();
    generateOwnHand(cardLayer);
    cardLayer.draw();
});

bgLayer.add(new Kinetic.Rect({
    width: stage.width(),
    height: stage.height(),
    fill: '#EEEEEE'
}));

stage.add(bgLayer);
stage.add(cardLayer);
//# sourceMappingURL=main.js.map

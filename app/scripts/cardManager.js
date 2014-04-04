/**
* Created by mitch on 2014-04-01.
*/
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="definitions/firebase.d.ts" />
var CardManager;
(function (CardManager) {
    var cardTypeInfo = {
        white: {
            textColor: 'black',
            imageURL: '/resources/whiteCard.png'
        },
        black: {
            textColor: 'white',
            imageURL: '/resources/blackCard.png'
        }
    };

    function loadDecksIntoDeckRefs(whiteDeckRef, blackDeckRef) {
        Util.getJSON("/resources/cards.json", function (cardDataArray) {
            var whiteDeck = [];
            var blackDeck = [];
            cardDataArray.forEach(function (cardData) {
                if (cardData['expansion'] == "Base") {
                    var cardText = cardData['text'];
                    if (cardData['cardType'] == "A") {
                        whiteDeck.push(cardText);
                    } else if (cardData["cardType"] == "Q") {
                        blackDeck.push(cardText);
                    }
                }
            });
            Util.shuffle(whiteDeck).forEach(function (cardText) {
                whiteDeckRef.push(cardText);
            });
            Util.shuffle(blackDeck).forEach(function (cardText) {
                blackDeckRef.push(cardText);
            });
            console.log("Parsed " + whiteDeck.length + " white cards and " + blackDeck.length + " black cards");
        });
    }
    CardManager.loadDecksIntoDeckRefs = loadDecksIntoDeckRefs;

    var Card = (function () {
        function Card(text, type) {
            this.text = decodeURIComponent(text.replace("%", "%25"));
            this.type = type;
            this.setSelected(false);
            this.generateView();
        }
        Card.prototype.generateView = function (width, height) {
            var _this = this;
            if (typeof width === "undefined") { width = 100; }
            if (typeof height === "undefined") { height = 120; }
            var typeData = cardTypeInfo[this.type];
            var view = new Kinetic.Group({
                offset: {
                    x: (width / 2),
                    y: height
                }
            });

            var text = new Kinetic.Text({
                x: 10,
                y: 15,
                width: width - 20,
                height: height - 50,
                text: this.text,
                fontSize: 13,
                fontFamily: 'Helvetica',
                wrap: 'word',
                fill: typeData['textColor']
            });
            view.add(text);

            var border = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: width,
                height: height,
                stroke: 'lightgray',
                fillAlpha: 0.0
            });
            view.add(border);

            var image = new Kinetic.Image({
                x: 0,
                y: 0,
                width: width,
                height: height
            });
            Util.loadKineticImage(image, typeData['imageURL'], function () {
                view.add(image);
            });

            view.on('click tap', function (event) {
                _this.onSelect(event);
            });
            this.border = border;
            this.view = view;
        };

        Card.prototype.setSelected = function (selected) {
            if (this.selectionTween != null) {
                if (selected) {
                    this.selectionTween.play();
                } else {
                    this.selectionTween.reverse();
                }
            }
            this.selected = selected;
        };

        Card.prototype.onSelect = function (event) {
            this.setSelected(true);
        };

        Card.prototype.onDeselect = function (event) {
            this.setSelected(false);
        };
        return Card;
    })();
    CardManager.Card = Card;
})(CardManager || (CardManager = {}));
//# sourceMappingURL=cardManager.js.map

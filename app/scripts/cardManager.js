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
           whiteDeck = Util.shuffle(whiteDeck);
           blackDeck = Util.shuffle(blackDeck);
           whiteDeckRef.set(whiteDeck);
           blackDeckRef.set(blackDeck);
            console.log("Parsed " + whiteDeck.length + " white cards and " + blackDeck.length + " black cards");
        });
    }
    CardManager.loadDecksIntoDeckRefs = loadDecksIntoDeckRefs;

    var Card = (function () {
        function Card(text, type) {
           this.view = null;
           this.selected = false;
            this.text = decodeURIComponent(text.replace("%", "%25"));
            this.type = type;
        }
        Card.prototype.generateView = function (width, height) {
           if (typeof width === "undefined") {
              width = 110;
           }
            if (typeof height === "undefined") { height = 120; }
            var typeData = cardTypeInfo[this.type];
            var view = new Kinetic.Group({
                offset: {
                    x: (width / 2),
                    y: height
                },
               width: width,
               height: height
            });

            var text = new Kinetic.Text({
                x: 10,
               y: 10,
               width: width - 15,
               height: height - 15,
                text: this.text,
               fontSize: 11,
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
               image.moveToBottom();
               var layer = view.getLayer();
               if (layer) {
                  layer.draw();
               }
            });

            this.view = view;
           return view;
        };

        Card.prototype.setSelected = function (selected) {
           this.selected = selected;
            if (this.selectionTween != null) {
                if (selected) {
                    this.selectionTween.play();
                } else {
                    this.selectionTween.reverse();
                }
            }
        };
        return Card;
    })();
    CardManager.Card = Card;
})(CardManager || (CardManager = {}));
//# sourceMappingURL=cardManager.js.map

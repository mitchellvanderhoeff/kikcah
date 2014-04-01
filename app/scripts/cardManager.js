/**
* Created by mitch on 2014-04-01.
*/
/// <reference path="kinetic.d.ts" />
/// <reference path="util.ts" />
var CardManager;
(function (CardManager) {
    var allWhiteCards = [];
    var allBlackCards = [];
    var whiteCards = [];
    var blackCards = [];

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

    function populateCardData(callback) {
        if (typeof callback === "undefined") { callback = (function () {
        }); }
        Util.getJSON("/resources/cards.json", function (json) {
            var parsed = JSON.parse(json);
            parsed.forEach(function (cardData) {
                if (cardData['expansion'] == "Base") {
                    if (cardData['cardType'] == "A") {
                        var card = new Card(cardData['text'], 'white');
                        allWhiteCards.push(card);
                    } else if (cardData["cardType"] == "Q") {
                        var card = new Card(cardData['text'], 'black');
                        allBlackCards.push(card);
                    }
                }
            });
            console.log("Parsed " + allWhiteCards.length + " white cards and " + allBlackCards.length + " black cards");
            callback();
        });
    }
    CardManager.populateCardData = populateCardData;

    function shuffleCards() {
        whiteCards = Util.shuffle(allWhiteCards);
        blackCards = Util.shuffle(allBlackCards);
    }
    CardManager.shuffleCards = shuffleCards;

    function dealWhiteCard() {
        var card = whiteCards[0];
        whiteCards.splice(0, 1);
        return card;
    }
    CardManager.dealWhiteCard = dealWhiteCard;

    function dealBlackCard() {
        var card = blackCards[0];
        blackCards.splice(0, 1);
        return card;
    }
    CardManager.dealBlackCard = dealBlackCard;

    var Card = (function () {
        function Card(text, type) {
            this.text = text;
            this.type = type;
            if (/\&\w+\;/.test(text)) {
                this.text = decodeURIComponent(text);
            }
            this.generateView();
        }
        Card.prototype.generateView = function (width, height) {
            if (typeof width === "undefined") { width = 100; }
            if (typeof height === "undefined") { height = 150; }
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
                fontSize: 14,
                fontFamily: 'Helvetica',
                wrap: 'word',
                fill: typeData['textColor']
            });
            var border = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: width,
                height: height,
                stroke: 'lightgray',
                fillAlpha: 0.0
            });
            var imageData = new Image();
            imageData.onload = function () {
                var image = new Kinetic.Image({
                    x: 0,
                    y: 0,
                    image: imageData,
                    width: width,
                    height: height
                });
                view.add(image);
                view.add(text);
                view.add(border);
                view.draw();
            };
            imageData.src = typeData['imageURL'];
            view['model'] = this;
            view['border'] = border;
            this.view = view;
        };
        return Card;
    })();
    CardManager.Card = Card;
})(CardManager || (CardManager = {}));
//# sourceMappingURL=cardManager.js.map

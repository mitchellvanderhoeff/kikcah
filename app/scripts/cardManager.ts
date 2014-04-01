/**
 * Created by mitch on 2014-04-01.
 */
/// <reference path="kinetic.d.ts" />
/// <reference path="util.ts" />

module CardManager {
    var allWhiteCards: Array<Card> = [];
    var allBlackCards: Array<Card> = [];
    var whiteCards: Array<Card> = [];
    var blackCards: Array<Card> = [];

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

    export function populateCardData(callback: Function = (() => {
    })) {
        Util.getJSON("/resources/cards.json", (json: string) => {
            var parsed = JSON.parse(json);
            parsed.forEach(cardData => {
                if (cardData['expansion'] == "Base") {
                    if (cardData['cardType'] == "A") {
                        var card = new Card(cardData['text'], 'white');
                        console.log("adding white card " + card);
                        allWhiteCards.push(card);
                    } else if (cardData["cardType"] == "Q") {
                        var card = new Card(cardData['text'], 'black');
                        console.log("adding white card " + card);
                        allBlackCards.push(card);
                    }
                }
            });
            callback();
        });
    }

    function shuffle<T>(src: Array<T>): Array<T> {
        var dest: Array<T> = [];
        var length = src.length;
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.round(Math.random() * src.length);
            dest.push(src[randomIndex]);
        }
        return dest;
    }

    export function shuffleCards() {
        whiteCards = shuffle(allWhiteCards);
        blackCards = shuffle(allBlackCards);
    }

    export function dealWhiteCard(): Card {
        var card = whiteCards[0];
        whiteCards.splice(0, 1);
        return card;
    }

    export function dealBlackCard(): Card {
        var card = blackCards[0];
        blackCards.splice(0, 1);
        return card;
    }

    export class Card {
        public view: Kinetic.Group;

        constructor(public text: string, public type: string) {
            this.generateView();
        }

        private generateView(width: number = 100, height: number = 150) {
            var typeData = cardTypeInfo[this.type];
            var view = new Kinetic.Group();
            var text = new Kinetic.Text({
                x: 10,
                y: 15,
                width: width - 20,
                height: height - 50,
                text: this.text,
                fontSize: 16,
                fontFamily: 'Helvetica',
                fill: typeData['textColor']
            });
            var border = new Kinetic.Rect({
                x: 0,
                y: 0,
                width: width,
                height: height,
                stroke: '#E5E5E5',
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
            this.view = view;
        }
    }
}
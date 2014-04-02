/**
 * Created by mitch on 2014-04-01.
 */
/// <reference path="definitions/kinetic.d.ts" />
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

    export function populateCardData(callback: Function = (function () {
    })) {
        Util.getJSON("/resources/cards.json", (cardDataArray: Array<Object>) => {
            cardDataArray.forEach(cardData => {
                if (cardData['expansion'] == "Base") {
                    var cardText = cardData['text'];
                    if (cardData['cardType'] == "A") {
                        var card = new Card(cardText, 'white');
                        allWhiteCards.push(card);
                    } else if (cardData["cardType"] == "Q") {
                        var card = new Card(cardText, 'black');
                        allBlackCards.push(card);
                    }
                }
            });
            console.log("Parsed " + allWhiteCards.length + " white cards and " + allBlackCards.length + " black cards");
            callback();
        });
    }

    export function shuffleCards() {
        whiteCards = Util.shuffle(allWhiteCards);
        blackCards = Util.shuffle(allBlackCards);
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
        public text: string;
        public type: string;
        public view: Kinetic.Group;
        public selectionTween: Kinetic.Tween;

        private border: Kinetic.Rect;
        private selected: boolean;

        constructor(text: string, type: string) {
            this.text = decodeURIComponent(text.replace("%", "%25"));
            this.type = type;
            this.setSelected(false);
            this.generateView();
        }

        private generateView(width: number = 100, height: number = 120) {
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
            view.on('click tap', (event) => {
                this.onSelect(event);
            });
            this.border = border;
            this.view = view;
        }

        private setSelected(selected: boolean) {
            if (this.selectionTween != null) {
                if (selected) {
                    this.selectionTween.play();
                } else {
                    this.selectionTween.reverse();
                }
            }
            this.selected = selected;
        }

        public onSelect(event: Event) {
            this.setSelected(true);
        }

        public onDeselect(event: Event) {
            this.setSelected(false);
        }
    }
}
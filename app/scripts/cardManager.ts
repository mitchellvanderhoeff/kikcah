/**
 * Created by mitch on 2014-04-01.
 */
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="definitions/firebase.d.ts" />

module CardManager {
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

    export function loadDecksIntoDeckRefs(whiteDeckRef: Firebase, blackDeckRef: Firebase) {
        Util.getJSON("/resources/cards.json", (cardDataArray: Array<Object>) => {
            var whiteDeck: Array<string> = [];
            var blackDeck: Array<string> = [];
            cardDataArray.forEach(cardData => {
                if (cardData['expansion'] == "Base") {
                    var cardText = cardData['text'];
                    if (cardData['cardType'] == "A") {
                        whiteDeck.push(cardText);
                    } else if (cardData["cardType"] == "Q") {
                        blackDeck.push(cardText);
                    }
                }
            });
            Util.shuffle(whiteDeck).forEach(cardText => {
                whiteDeckRef.push(cardText);
            });
            Util.shuffle(blackDeck).forEach(cardText => {
                blackDeckRef.push(cardText);
            });
            console.log("Parsed " + whiteDeck.length + " white cards and " + blackDeck.length + " black cards");
        });
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
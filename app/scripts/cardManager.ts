/**
 * Created by mitch on 2014-04-01.
 */
/// <reference path="kinetic.d.ts" />

module CardManager {
    export var CardType = {
        white: {
            textColor: 'black',
            imageURL: '/resources/whiteCard.png'
        },
        black: {
            textColor: 'white',
            imageURL: '/resources/blackCard.png'
        }
    };

    export function createCard(cardText:string, cardType:Object):Kinetic.Group {
        var width = 100;
        var height = 150;
        var card = new Kinetic.Group({
            draggable: true
        });
        var text = new Kinetic.Text({
            x: 10,
            y: 15,
            width: width - 20,
            height: height - 50,
            text: cardText,
            fontSize: 16,
            fontFamily: 'Helvetica',
            fill: cardType['textColor']
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
            card.add(image);
            card.add(text);
            card.add(border);
            card.draw();
        };
        imageData.src = cardType['imageURL'];
        return card;
    }
}
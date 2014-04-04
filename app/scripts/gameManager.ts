/**
 * Created by mitch on 2014-04-02.
 */
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="util.ts" />
/// <reference path="cardManager.ts" />
/// <reference path="game.ts" />
/// <reference path="definitions/firebase.d.ts" />
/// <reference path="main.ts" />

import Card = CardManager.Card;

class GameManager {
    private bgLayer: Kinetic.Layer;
    private topBarLayer: Kinetic.Layer;
    private gameLayer: Kinetic.Layer;
    private static topBarHeight: number = 55;

    private playersRef: Firebase;
    private scoresRef: Firebase;

    constructor(private stage: Kinetic.Stage, private gameRef: Firebase, private kikUser: KikUser) {
        this.playersRef = gameRef.child('players');
        this.scoresRef = gameRef.child('scores');
        this.setupGraphics();
    }

    private static makeBack(): Kinetic.Group {
        var view = new Kinetic.Group();
        view.add(Util.makeText({
            fill: 'white',
            fontSize: 20,
            text: "Back"
        }));
        return view;
    }

    private static makeInvite(): Kinetic.Group {
        var view = new Kinetic.Group();
        view.add(Util.makeText({
            fill: 'white',
            fontSize: 20,
            text: "Invite"
        }));
        return view;
    }

    private inviteButtonClicked(event: Event) {
        kik.pickUsers({
            minResults: 1,
            maxResults: 1
        }, (users: Array<any>) => {
            if (users && users[0]) {
                var user: KikUser = users[0];
                this.playersRef.push(user.username);
                this.scoresRef.push(0);
                var userRef = firebase.ref("/users/" + user.username);
                userRef
                    .once('value', snapshot => {
                        if (snapshot.val() == null) {
                            userRef.set({
                                "username": user.username,
                                "participatingGames": []
                            })
                        }
                        userRef.child('participatingGames').push(this.gameRef.name())
                    });
                kik.send(user.username, {
                    title: "Cards Against Humanity",
                    text: this.kikUser.username + " has invited you to play Cards Against Humanity!"
                })
            }
        })
    }

    private setupGraphics() {
        this.bgLayer = new Kinetic.Layer({
            width: this.stage.width(),
            height: this.stage.height()
        });

        this.bgLayer.add(new Kinetic.Rect({
            width: this.bgLayer.width(),
            height: this.bgLayer.height(),
            fill: 'white'
        }));

        this.topBarLayer = new Kinetic.Layer({
            width: this.stage.width(),
            height: GameManager.topBarHeight
        });

        var back = GameManager.makeBack();
        back.width(60);
        back.position({x: 7, y: this.topBarLayer.height() / 3});
        back.on('click tap', (event: Event) => {
            this.stage.destroyChildren();
            new Main(this.stage).main();
        });
        Util.addDownstate(back);

        var invite = GameManager.makeInvite();
        invite.width(55);
        invite.position({x: this.topBarLayer.width() - invite.width() - 7, y: this.topBarLayer.height() / 3});
        invite.on('click tap', (event: Event) => {
            this.inviteButtonClicked(event);
        });
        Util.addDownstate(invite);

        this.topBarLayer.add(new Kinetic.Rect({
            width: this.topBarLayer.width(),
            height: this.topBarLayer.height(),
            fill: 'black'
        }));
        this.topBarLayer.add(back);
        this.topBarLayer.add(invite);

        this.gameLayer = new Kinetic.Layer({
            width: this.stage.width(),
            height: this.stage.height() - this.topBarLayer.height(),
            y: this.topBarLayer.height()
        });

        this.stage.add(this.bgLayer);
        this.stage.add(this.topBarLayer);
        this.stage.add(this.gameLayer);
    }

    public start() {

    }

    private calculateFanPosition(coefficient: number): { x: number; y: number; rotation: number } {
        var offsetFromBottom: number = -650.0;
        var cardFanRadius: number = 700.0;
        var angleOffsetCoefficient = 0.455;
        var angleStart = Math.PI * (1 - angleOffsetCoefficient);
        var angleEnd = Math.PI * angleOffsetCoefficient;
        var angleRadians: number = angleStart + (coefficient * (angleEnd - angleStart));
        var angleDegrees: number = (angleRadians * (180 / Math.PI));
        return {
            x: this.stage.width() / 2 + cardFanRadius * Math.cos(angleRadians),
            y: this.stage.height() - cardFanRadius * Math.sin(angleRadians) - offsetFromBottom,
            rotation: 90 - angleDegrees
        }
    }

    private dealOwnHand(layer: Kinetic.Layer, numCards: number = 8): Array<Card> {
        var cards: Array<Card> = [];
        for (var i = 0; i < numCards; i++) {
            var card: Card = CardManager.dealWhiteCard();
            var coefficient: number = ((i + 0.5) / numCards);
            var fanPosition = this.calculateFanPosition(coefficient);
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
}
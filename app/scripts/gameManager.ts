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
    private static topBarHeight: number = 55;
    private static requiredNumWhiteCards: number = 8;

    private bgLayer: Kinetic.Layer;
    private topBarLayer: Kinetic.Layer;
    private gameLayer: Kinetic.Layer;
    private cardsGroup: Kinetic.Group;
    private submittedCardText: Kinetic.Text;
    private selectedCard: Card;

    private players: Array<Object> = [];
    private whiteCardsMap: Object = {};
    private blackCard: string;
    private isGameMaster: boolean = false;

    private playersRef: Firebase;
    private myPlayerRef: Firebase;
    private whiteCardsRef: Firebase;
    private blackCardRef: Firebase;

    constructor(private stage: Kinetic.Stage, private gameRef: Firebase, private kikUser: KikUser) {
        this.setupGraphics();
        this.blackCardRef = gameRef.child('currentBlackCard');
        this.playersRef = gameRef.child('players');
        this.playersRef.on('child_added', (snapshot) => {
            var player = snapshot.val();
            this.players.push(player);
            var playerName = player['username'];
            if (!this.myPlayerRef && playerName == this.kikUser.username) {
                this.myPlayerRef = snapshot.ref();
                this.whiteCardsRef = this.myPlayerRef.child('whiteCards');
                this.start();
            }
        });
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
                this.playersRef.push({
                    username: user.username,
                    score: 0
                });
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
            height: this.stage.height() - this.topBarLayer.height() - this.topBarLayer.x(),
            x: 0,
            y: this.topBarLayer.height()
        });

        var backgroundRect = new Kinetic.Rect({
            x: 0,
            y: 0,
            width: this.gameLayer.width(),
            height: this.gameLayer.height()
        });
        backgroundRect.on('click tap', () => {
            if (this.selectedCard) {
                this.selectedCard.setSelected(false);
                this.selectedCard = null;
            }
        });
        this.gameLayer.add(backgroundRect);

        this.stage.add(this.bgLayer);
        this.stage.add(this.topBarLayer);
        this.stage.add(this.gameLayer);
    }

    public start() {
        // todo: custom cards

        this.whiteCardsRef.once('value', snapshot => {
            var numCardsToAdd = GameManager.requiredNumWhiteCards - snapshot.numChildren();
            if (numCardsToAdd <= 0) {
                return;
            }
            var refsToRemove = [];
            var deckRef = this.gameRef.child('whiteDeck');
            console.log("Adding " + numCardsToAdd + " cards");
            deckRef
                .startAt()
                .limit(numCardsToAdd)
                .once('value', snapshot => {
                    snapshot.forEach(snapshot => {
                        var cardText = snapshot.val();
                        console.log("adding '" + cardText + "'");
                        this.whiteCardsRef.push(cardText);
                        refsToRemove.push(snapshot.ref());
                        return false;
                    });

                    refsToRemove.forEach(ref => ref.remove());
                });
        });

        var renderTimeout;
        this.whiteCardsRef.on('child_added', snapshot => {
            var cardText = snapshot.val();
            var card: Card = new Card(cardText, 'white');
            this.whiteCardsMap[snapshot.name()] = card;
            if (renderTimeout) {
                clearTimeout(renderTimeout);
            }
            renderTimeout = setTimeout(() => {
                this.renderWhiteCards();
            }, 200)
        });

        this.whiteCardsRef.on('child_removed', snapshot => {
            delete this.whiteCardsMap[snapshot.name()];
            var deckRef = this.gameRef.child('whiteDeck');
            deckRef
                .limit(1)
                .once('value', snapshot => {
                    snapshot.forEach(snapshot => {
                        var cardText = snapshot.val();
                        if (cardText) {
                            console.log("adding '" + cardText + "' after removal");
                            this.whiteCardsRef.push(cardText);
                            snapshot.ref().remove();
                        }
                        return false;
                    });
                });
        });

        this.blackCardRef.on('value', snapshot => {
            this.blackCard = snapshot.val();
            if (!this.blackCard) {
                this.gameRef
                    .child('blackDeck')
                    .limit(1)
                    .once('child_added', snapshot => {
                        snapshot.ref().remove();
                        this.blackCardRef.set(snapshot.val());
                        this.renderBlackCard()
                    });
                return;
            }
            this.renderBlackCard();
        });

        this.gameRef.child('currentGameMasterIndex').on('value', snapshot => {
            var gameMaster = this.players[snapshot.val() || 0];
            this.isGameMaster = (gameMaster['username'] == this.kikUser.username);
        });

        this.gameRef.child('submittedWhiteCards').on('value', snapshot => {
            var numSubmitted = snapshot.numChildren();
            this.submittedCardText.text(numSubmitted + " submitted");
            this.gameLayer.draw();
            if (this.isGameMaster && numSubmitted == this.players.length - 1) {
                // todo: display cards to choose from for the game master
            }
        });
    }

    private calculateFanPosition(coefficient: number): { x: number; y: number; rotation: number } {
        var offsetFromBottom: number = -630.0;
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

    private renderWhiteCards() {
        this.selectedCard = null;
        var cardIndex = 0;
        for (var whiteCardID in this.whiteCardsMap) {
            var card: Card = this.whiteCardsMap[whiteCardID];
            if (card.view) {
                card.view.destroy();
            }
            var cardView = card.generateView();
            var coefficient: number = ((cardIndex + 0.5) / GameManager.requiredNumWhiteCards);
            cardIndex += 1;
            var fanPosition = this.calculateFanPosition(coefficient);
            cardView.setX(fanPosition.x);
            cardView.setY(fanPosition.y);
            cardView.rotate(fanPosition.rotation);

            cardView['model'] = card;
            card['gameManager'] = this;
            card['cardID'] = whiteCardID;

            cardView.on('click tap', function () {
                var card: Card = this['model'];
                var gameManager: GameManager = card['gameManager'];
                if (card.selected) { // Submit the card
                    gameManager.whiteCardsRef.child(card['cardID']).remove();
                    gameManager.gameRef
                        .child('submittedWhiteCards')
                        .child(gameManager.kikUser.username).push(card.text);
                    this.destroy(); // destroy view
                    gameManager.gameLayer.draw();
                } else {
                    if (gameManager.selectedCard) {
                        gameManager.selectedCard.setSelected(false);
                    }
                    card.setSelected(true);
                    gameManager.selectedCard = card;
                }
            });
            this.gameLayer.add(card.view);
            cardView.moveToTop();
            this.gameLayer.draw();

            var magnificationFactor = 1.3;

            var magnifyTween = new Kinetic.Tween({
                node: cardView,
                scaleX: magnificationFactor,
                scaleY: magnificationFactor,
                y: card.view.getY() - 100,
                easing: Kinetic.Easings.EaseInOut,
                duration: 0.1
            });

            card.selectionTween = magnifyTween;
        }
    }

    private renderBlackCard() {
        var blackCard: Card = new Card(this.blackCard, 'black');
        blackCard.generateView();
        this.gameLayer.add(blackCard.view);
        blackCard.view.position({
            x: 70,
            y: 130
        });
        var submittedCardView = new Card("", 'white').generateView();
        this.submittedCardText = Util.makeText({
            fill: 'black',
            fontSize: 16,
            align: 'center',
            width: submittedCardView.width(),
            x: 0,
            y: submittedCardView.height() / 2,
            text: "0 submitted"
        });
        submittedCardView.position({
            x: blackCard.view.x() + 120,
            y: blackCard.view.y()
        });
        submittedCardView.add(this.submittedCardText);
        this.gameLayer.add(submittedCardView);
        this.submittedCardText.moveToTop();
        blackCard.view.moveToBottom();
        submittedCardView.moveToBottom();
        this.gameLayer.draw();
    }
}
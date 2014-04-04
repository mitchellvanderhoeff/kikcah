/**
 * Created by mitch on 2014-04-03.
 */

interface Game {
    players:                Object;

    dateStarted:            number;

    whiteDeck:              Array<string>;
    blackDeck:              Array<string>;
    currentBlackCard:       number;
    submittedWhiteCards:    number;

    gameMasterIndex:        number;
    winningScore:           number;

    onSelected:             (event: Event) => void;
}

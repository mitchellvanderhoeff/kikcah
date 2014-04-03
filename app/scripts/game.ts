/**
 * Created by mitch on 2014-04-03.
 */

interface Game {
    players:                Array<string>;
    scores:                 Array<number>;

    dateStarted:            number;
    currentBlackCardID:     number;
    currentGameMasterIndex: number;
    winningScore:           number;

    onSelected:             (event: Event) => void;
}

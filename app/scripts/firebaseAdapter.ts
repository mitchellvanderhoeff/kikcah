/**
 * Created by mitch on 2014-04-02.
 */
/// <reference path="definitions/firebase.d.ts" />

module firebase {
    export function createRef(nodePath: string): Firebase {
        var FB_URL = "https://sizzling-fire-9239.firebaseio.com/";
        return new Firebase(FB_URL + nodePath);
    }
}
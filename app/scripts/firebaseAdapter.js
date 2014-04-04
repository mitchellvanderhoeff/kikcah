/**
* Created by mitch on 2014-04-02.
*/
/// <reference path="definitions/firebase.d.ts" />
var firebase;
(function (firebase) {
    function ref(nodePath) {
        var FB_URL = "https://sizzling-fire-9239.firebaseio.com/";
        return new Firebase(FB_URL + nodePath);
    }
    firebase.ref = ref;
})(firebase || (firebase = {}));
//# sourceMappingURL=firebaseAdapter.js.map

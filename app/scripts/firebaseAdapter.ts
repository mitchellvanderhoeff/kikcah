/**
 * Created by mitch on 2014-04-02.
 */
/// <reference path="definitions/firebase.d.ts" />
module firebase {
    export class FirebaseRef extends Firebase {
        public getValueOnce(callback: (snapshot: IFirebaseDataSnapshot) => void) {
            this.once('value', callback);
        }

        public onValueChanged(callback: (snapshot: IFirebaseDataSnapshot) => void) {
            this.on('value', callback);
        }

        public onChildAdded(callback: (snapshot: IFirebaseDataSnapshot) => void) {
            this.on('child_added', callback);
        }
    }

    export function createRef(nodePath: string): FirebaseRef {
        var FB_URL = "https://sizzling-fire-9239.firebaseio.com/";
        return new FirebaseRef(FB_URL + nodePath);
    }
}

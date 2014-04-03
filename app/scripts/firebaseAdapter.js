var __extends = this.__extends || function (d, b) {
   for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
   function __() {
      this.constructor = d;
   }

   __.prototype = b.prototype;
   d.prototype = new __();
};
/**
 * Created by mitch on 2014-04-02.
 */
/// <reference path="definitions/firebase.d.ts" />
var firebase;
(function (firebase) {
   var FirebaseRef = (function (_super) {
      __extends(FirebaseRef, _super);
      function FirebaseRef() {
         _super.apply(this, arguments);
      }

      FirebaseRef.prototype.getValueOnce = function (callback) {
         this.once('value', callback);
      };

      FirebaseRef.prototype.onValueChanged = function (callback) {
         this.on('value', callback);
      };

      FirebaseRef.prototype.onChildAdded = function (callback) {
         this.on('child_added', callback);
      };
      return FirebaseRef;
   })(Firebase);
   firebase.FirebaseRef = FirebaseRef;

   function createRef(nodePath) {
      var FB_URL = "https://sizzling-fire-9239.firebaseio.com/";
      return new FirebaseRef(FB_URL + nodePath);
   }

   firebase.createRef = createRef;
})(firebase || (firebase = {}));
//# sourceMappingURL=firebaseAdapter.js.map

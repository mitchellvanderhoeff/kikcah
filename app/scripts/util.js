/**
 * Created by mitch on 2014-04-01.
 */
var Util;
(function (Util) {
   function getJSON(url, callback) {
      var request = new XMLHttpRequest();
      request.overrideMimeType("application/json");
      request.open('GET', url, true);
      request.onreadystatechange = function () {
         if (request.readyState == 4 && request.status == 200) {
            callback(JSON.parse(request.responseText));
         }
      };
      request.send(null);
   }

   Util.getJSON = getJSON;

   function shuffle(src) {
      var dest = [];
      var length = src.length;
      for (var i = 0; i < length; i++) {
         var randomIndex = Math.round(Math.random() * src.length);
         dest.push(src[randomIndex]);
      }
      return dest;
   }

   Util.shuffle = shuffle;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map

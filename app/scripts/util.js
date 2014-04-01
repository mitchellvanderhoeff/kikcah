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
            callback(request.responseText);
         }
      };
      request.send(null);
   }

   Util.getJSON = getJSON;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map

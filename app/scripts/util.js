/**
 * Created by mitch on 2014-04-01.
 */
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
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

   function rectInset(rect, inset) {
      return {
         x: rect.x + inset.x,
         y: rect.y + inset.y,
         width: rect.width - 2 * inset.x,
         height: rect.height - 2 * inset.y
      };
   }

   Util.rectInset = rectInset;

   function loadKineticImage(image, url, callback) {
      var imageData = new Image();
      imageData.onload = function () {
         image.image(imageData);
         callback(imageData);
      };
      imageData.src = url;
   }

   Util.loadKineticImage = loadKineticImage;

   function loadSVG(url, callback) {
      var request = new XMLHttpRequest();
      request.overrideMimeType("image/svg+xml");
      request.open('GET', url, true);
      request.onreadystatechange = function () {
         if (request.readyState == 4 && request.status == 200) {
            var path = new Kinetic.Path({
               data: request.responseText
            });
            callback(path);
         }
      };
      request.send(null);
   }

   Util.loadSVG = loadSVG;

   function makeText(options) {
      var text = new Kinetic.Text(_.extend(options, {
         fontFamily: 'Helvetica',
         fontStyle: 'bold'
      }));
      return text;
   }

   Util.makeText = makeText;

   function addDownstate(node) {
      var originalOpacity = node.opacity();
      node.on('touchstart mousedown', function () {
         node.opacity(0.75);
         node.getLayer().draw();
      });
      node.on('touchend mouseup mouseout', function () {
         node.opacity(originalOpacity);
         node.getLayer().draw();
      });
   }

   Util.addDownstate = addDownstate;
})(Util || (Util = {}));
//# sourceMappingURL=util.js.map

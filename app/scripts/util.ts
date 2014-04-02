/**
 * Created by mitch on 2014-04-01.
 */
module Util {
    export function getJSON(url: string, callback: Function) {
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

    export function shuffle<T>(src: Array<T>): Array<T> {
        var dest: Array<T> = [];
        var length = src.length;
        for (var i = 0; i < length; i++) {
            var randomIndex = Math.round(Math.random() * src.length);
            dest.push(src[randomIndex]);
        }
        return dest;
    }

}
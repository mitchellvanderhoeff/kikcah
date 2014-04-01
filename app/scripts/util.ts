/**
 * Created by mitch on 2014-04-01.
 */
module Util {
    export function getJSON(url:string, callback:Function) {
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
}
/**
 * Created by mitch on 2014-04-01.
 */
/// <reference path="definitions/kinetic.d.ts" />

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

    export interface Rect {
        x: number;
        y: number;
        width: number;
        height: number;
    }

    export interface Inset {
        x: number;
        y: number;
    }

    export function rectInset(rect: Rect, inset: Inset): Rect {
        return {
            x: rect.x + inset.x,
            y: rect.y + inset.y,
            width: rect.width - 2 * inset.x,
            height: rect.height - 2 * inset.y
        }
    }

    export function loadKineticImage(image: Kinetic.Image, url: string, callback: (image: HTMLImageElement) => void) {
        var imageData = new Image();
        imageData.onload = function () {
            image.image(imageData);
            callback(imageData);
        };
        imageData.src = url;
    }
}
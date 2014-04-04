/**
 * Created by mitch on 2014-04-01.
 */
/// <reference path="definitions/kinetic.d.ts" />
/// <reference path="definitions/underscore.d.ts" />
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

    export function loadSVG(url: string, callback: (path: Kinetic.Path) => void) {
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

    export function makeText(options: Object): Kinetic.Text {
        var text = new Kinetic.Text(_.extend(options, {
            fontFamily: 'Helvetica',
            fontStyle: 'bold'
        }));
        return text;
    }

    export function addDownstate(node: Kinetic.Group) {
        var originalOpacity = node.opacity();
        node.on('touchstart mousedown', function () {
            node.opacity(0.75);
            node.getLayer().draw();
        });
        node.on('touchend mouseup mouseout', function () {
            node.opacity(originalOpacity);
            node.getLayer().draw();
        })
    }
}
/**
 * Created by mitch on 2014-04-02.
 */
declare module kik {
    export interface KikUser {
        username: string;
        fullName: string;
        firstName: string;
        lastName: string;
        pic: string;
        thumbnail: string;
    }
    export function getUser(callback: (user: KikUser) => void): void;

    export function pickUsers(options: Object, callback: (users: Array<any>) => void);

    export function send(username: string, data: Object);
}
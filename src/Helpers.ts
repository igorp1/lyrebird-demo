import cookie from 'cookie'
import { IncomingMessage, ServerResponse } from 'http';

export default class Helpers {

    // 🍪 COOKIES
    static readCookie(cookieName : string, nextReq? : IncomingMessage ) : any{
        let cookies = nextReq ? nextReq.headers.cookie : document.cookie
        if(cookies instanceof Array) cookies = cookies.join('')
        return cookie.parse(cookies || '')[cookieName]
    }
    static setCookie(cookieName : string, cookieValue : string, nextRes? : ServerResponse ){
        if(cookieValue.length > 4500) throw `'cookieValue' is too long(${cookieValue.length} charcater) to be stored in a cookie`
        const newCookie = cookie.serialize(cookieName, cookieValue)
        if(nextRes) nextRes.setHeader('Set-Cookie', newCookie)
        else document.cookie = newCookie
    }    
    static deleteCookie(cookieName : string, nextRes? : ServerResponse ){
        const deletedCookie = cookie.serialize(cookieName, '', {maxAge:-1})
        if(nextRes) nextRes.setHeader('Set-Cookie', deletedCookie)
        else document.cookie = deletedCookie
    }

}
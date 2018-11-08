import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";

export enum ResponseErrorType {
    Timeout = 'The request to Lyrebird timed out and was canceled.',
    Unauthorized = 'The request was not properly authorized',
    TextLength = 'The text legth is too long. It must be unnder 250 characters',
    Unknonw = 'An unknown error has ocurred' 
}

export interface SpeechDataResult {
    count : number
    next : string
    previous : string
    results : SpeechData[ ]
}
export interface SpeechData {
    created_at : string
    text : string
    url : string
}

class LyrebirdService {

    static readonly TIMEOUT : number = 9 // timeout in seconds. For sentences closer to 250 chars, 5 seconds was not enough

    static buildHeaders(token : string){
        return {   
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
        }
    }

    static generateSpeech(
        text:string, 
        callbackDone : (audioUrl : string, error?: ResponseErrorType)=>void, 
        callbackUploadProgress : ( progress : ProgressEvent )=>void,
        callbackDownloadProgress : ( progress : ProgressEvent )=>void,
        token : string) : void 
    {
        if(text.length > 250) return callbackDone('', ResponseErrorType.TextLength)

        const url = 'https://avatar.lyrebird.ai/api/v0/generate'
        const headers = this.buildHeaders(token)
        const config : AxiosRequestConfig = {
            url,
            headers,
            method : 'POST',
            data: { text },
            timeout : this.TIMEOUT * 1000,
            responseType: 'arraybuffer',
            onUploadProgress : callbackUploadProgress,
            onDownloadProgress : callbackDownloadProgress
        }
        
        Axios.request(config) 
            .then((res : AxiosResponse) => {
                const type = res.headers['Content-Type'] 
                const blob = new Blob([res.data], { type })
                const generatedAudioUrl = window.URL.createObjectURL(blob)
                
                callbackDone(generatedAudioUrl)            
            })
            .catch((error : any)=>{
                error = JSON.stringify(error)
                if(error.includes('timeout')) 
                    return callbackDone('', ResponseErrorType.Timeout)
                if(error.includes(''))
                    return callbackDone('', ResponseErrorType.Unauthorized)
                return callbackDone('', ResponseErrorType.Unknonw)
            })
    }

    private static fixOldNextPageUrl(url : string) : string{
        // must fix next page with wrong url
        // https://myvoice.lyrebird.ai/api/v0/generated/offset=20&limit=20
        if(!url) return ''
        const oldVersion = 'https://myvoice.lyrebird.ai/api/v0/generated/'
        const newVersion = 'https://avatar.lyrebird.ai/api/v0/generated?'
        const fixed = url.replace(oldVersion, newVersion)
        return fixed
    }

    private static getSpeeches(token : string, nextUrl:string|null, limit : number|null) : Promise<SpeechDataResult> {
        const headers = this.buildHeaders(token)
        const defaultLimit = 40 
        const url = nextUrl || `https://avatar.lyrebird.ai/api/v0/generated?limit=${limit || defaultLimit}&offset=0`

        return fetch(url, {headers}).then(res=>res.json())
    }

    static loadSpeeches( token : string, nextUrl : string|null, limit : number|null, callbackDone : (result? : SpeechDataResult, error?:string)=>void ) : void {
        this.getSpeeches(token, nextUrl, limit)
            .then((data : SpeechDataResult) =>{
                data.next = this.fixOldNextPageUrl(data.next)
                data.previous = this.fixOldNextPageUrl(data.previous)
                callbackDone(data)
            })
            .catch((error)=>callbackDone(undefined, error))
    }

    static async loadSpeechesSync ( token : string, nextUrl : string|null, limit : number|null ) : Promise<SpeechDataResult> {
        const data = await this.getSpeeches(token, nextUrl, limit)     
        data.next = this.fixOldNextPageUrl(data.next)
        data.previous = this.fixOldNextPageUrl(data.previous)
        
        return data 
    }


}

export default LyrebirdService
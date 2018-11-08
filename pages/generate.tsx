import React from 'react'
import styled from 'styled-components'
import { connect } from 'react-redux'
import { colors } from '../components/_common';
import LyrebirdService, { ResponseErrorType } from '../src/LyrebirdService';


const TextGenerationArea = styled.textarea`
    border-radius: 3px;
    min-height : 1.2em;
    height: 90px;
    width: 450px;
    font-size: 1em;
    resize: vertical;
    display: block;
    padding: 7px;
`

interface GenerateProps {
    authToken : string
}
class Generate extends React.Component<GenerateProps> {

    readonly DEFAULT_STATE = { 
        text: '', 
        audioUrl :'', 
        loading: false,
        error : '',
        loadingProgress : {
            timeout : false,
            uploaded : false,
            downloaded : 0
        }
    }
    state = this.DEFAULT_STATE

    // ACTIONS
    clearText = () => {
        this.setState(this.DEFAULT_STATE)
    }

    generate = () => {
        this.setState({loading:true})

        LyrebirdService.generateSpeech(
            this.state.text,
            this.resolveResult,
            this.trackUploadProgress,
            this.trackDownloadProgress,
            this.props.authToken
        )
    }

    // GENERATION REQUEST HANNDLERS
    trackUploadProgress = ( _ : ProgressEvent ) => {
        this.setState({ loadingProgress : {uploaded:true, downloaded:0} })
    }

    trackDownloadProgress = ({ loaded } : ProgressEvent ) => {
        const downloaded = this.state.loadingProgress.downloaded + loaded
        this.setState({loadingProgress: {uploaded:true, downloaded}})
    }
    
    resolveResult = ( audioUrl : string, error? : ResponseErrorType ) => {
        if(error) return this.handleError(error)

        this.setState({
            audioUrl, 
            loading: false,
            loadingProgress : { uploaded:true, downloaded:0 }
        })
    }

    handleError = (error:ResponseErrorType) => {
        switch(error){
            case ResponseErrorType.Timeout:
                return this.setState({ error:error.toString(), loadingProgress: { timeout:true, uploaded:true, downloaded:0 } })
            default:
                return this.setState({error:error.toString()})
        }
    }

    // RENDERERS
    get inputControls() {
        return (
            <div>
                <TextGenerationArea onChange={(e)=>this.setState({text:e.target.value})} value={this.state.text} />
                <button disabled={!this.state.text || this.state.text.length > 250} style={{marginTop:'1em'}} className='highlight' onClick={this.generate} >GENERATE</button>
                <button hidden={!this.state.text} style={{marginTop:'1em'}} className='discrete' onClick={this.clearText} ><b>CLEAR</b></button>
                <span style={{color:colors.error}} hidden={this.state.text.length <= 250} >Character limit reached {this.state.text.length}/250</span>
            </div>
        )
    }

    get audio() {
        return (
            <div hidden={!this.state.audioUrl}>
                <h3>Result <a style={{fontSize:'0.7em'}} href={this.state.audioUrl} download='Lyrebird Speech.wav'>Download now</a></h3>
                <audio controls src={this.state.audioUrl}>
                    Your browser does not support the <code>audio</code> element.
                </audio>
                <br/>
            </div>
        )
    }

    get progressIndicators() {
        return (
            <div hidden={!this.state.loading}>
                <ul style={{listStyle:'none', padding:'0'}}>
                    <li> 
                        {this.progressIcon(!this.state.loadingProgress.uploaded)}
                        <span> Uploading Text</span>
                    </li>
                    <li> 
                        {this.progressIcon(this.state.loadingProgress.downloaded === 0, this.state.loadingProgress.timeout)}
                        <span> Generating Speech</span>
                    </li>
                    <li> 
                        {this.progressIcon(true, this.state.loadingProgress.timeout)}
                        <span> Downloading Speech ({this.state.loadingProgress.downloaded}) </span>
                    </li>
                    <li>
                        <span style={{color:colors.error}}>{this.state.error}</span>
                    </li>
                </ul>
            </div>
        )
    }

    progressIcon = (loading : boolean, error?:boolean) => {
        if(error) return <i style={{color:colors.error}} className='material-icons'>error</i>
        return !loading ? 
            <i style={{color:colors.success}} className='material-icons'>done</i> :
            <img style={{height: '20px', verticalAlign: '-5px'}} src='https://www.sapstore.com/_ui/desktop/theme-sap-sapphire/images/spinner.gif' />
    }

    render =() => (
        <div>
            <h1>Generate</h1>
            {this.inputControls}
            {this.progressIndicators}
            {this.audio}
        </div>
    )
    

}

const mapstateToProps = ({authToken}: any) => ({authToken})
export default connect(mapstateToProps)(Generate)
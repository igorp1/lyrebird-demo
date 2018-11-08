import Document, { Main, NextScript } from 'next/document'
import { ServerStyleSheet, injectGlobal } from 'styled-components'
import { fonts, colors, shadow, transition } from '../components/_common';

injectGlobal`
    body {
        font-family: ${ fonts.default };
        margin : 0;
    }
    .material-icons{ 
        font-size: 1.4em;
        vertical-align: middle; 
    }

    p, li{line-height:2em;}

    .noselect {
        -webkit-touch-callout: none; 
        -webkit-user-select: none;
        -khtml-user-select: none; 
        -moz-user-select: none; 
        -ms-user-select: none; 
        user-select: none;
    }

    input{
        font-size: 0.9em;
        box-sizing : border-box;
        border: 0.05em solid ${colors.dark};
        padding: .5em 0.65em;
        border-radius: .2em;
        outline: none;
        transition: ${transition};
        font-family: ${fonts.default};
    }

    button{
        border: none;
        outline: none;
        margin: 7px;
        margin-left:0;
        cursor: pointer;
        padding: .5em 1em;
        border-radius: .1em;
        box-shadow: ${shadow.low};
        transition: ${transition};
        font-family: ${fonts.default};
        font-size: 0.9em;
        &.flat{
            box-shadow:none;
            border-radius:4px; 
            border:solid 1px #c5c5c5;
            &:hover{ box-shadow: ${shadow.low}; }
            &:active{ box-shadow: none; }
        }
        &.discrete {
            background-color: transparent;
            box-shadow: none;
            &:hover{ background-color: ${colors.light}; }
        }
        &.highlight{
            color: ${ colors.light };
            font-weight: bold;
            background-color: ${ colors.primary };
        }
        &:hover{
            box-shadow: ${shadow.medium};
        }
        &:active{
            box-shadow: ${shadow.low};
        }
        &:disabled {
            cursor: default;
            color : ${ colors.dark };
            background-color: #c5c5c5;
            box-shadow: ${shadow.low};
        }
    }

    #nprogress {
        pointer-events: none;
        .bar {
            background: ${colors.dark};

            position: fixed;
            z-index: 1031;
            top: 0;
            left: 0;

            width: 100%;
            height: 3px;
        }
        .peg {
            display: block;
            position: absolute;
            right: 0px;
            width: 100px;
            height: 100%;
            box-shadow: 0 0 10px ${colors.dark}, 0 0 5px ${colors.dark};
            opacity: 1.0;

            -webkit-transform: rotate(3deg) translate(0px, -4px);
            -ms-transform: rotate(3deg) translate(0px, -4px);
            transform: rotate(3deg) translate(0px, -4px);
        }
    }
`

export default class _Document extends Document<{ styleTags : React.ReactElement<{}>[], page:any }> {

    static getInitialProps ({ renderPage } : {renderPage:any} ) {

        const sheet = new ServerStyleSheet()
        const page = renderPage( (App:any) => (props:any) => sheet.collectStyles(<App {...props} />))
        const styleTags = sheet.getStyleElement()

        return { ...page, styleTags }
    }
  
    get fonts(){
        return [ 
            <link key={1} href="https://fonts.googleapis.com/css?family=Cutive+Mono" rel="stylesheet" />,
            <link key={2} href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
        ]
    }

    render () {
        return (
            <html>
                <head>
                    <title>-- --- --</title>
                    {this.fonts}
                    { this.props.styleTags }
                    <meta property='viewport' name='viewport' content='width=device-width,minimum-scale=1' />
                </head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </html>
        )
    }
}




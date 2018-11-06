import Document, { Main, NextScript } from 'next/document'
import { ServerStyleSheet, injectGlobal } from 'styled-components'
import { fonts, colors } from '../components/_common';

injectGlobal`
    body {
        font-family: ${ fonts.default };
        margin : 0;
    }
    .material-icons{ 
        font-size: 1.4em;
        vertical-align: middle; 
    }

    p, li{line-height:1.8em;}

    .noselect {
        -webkit-touch-callout: none; 
        -webkit-user-select: none;
        -khtml-user-select: none; 
        -moz-user-select: none; 
        -ms-user-select: none; 
        user-select: none;
    }

    #nprogress {
        pointer-events: none;
        .bar {
            background: ${colors.primary};

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
            box-shadow: 0 0 10px ${colors.primary}, 0 0 5px ${colors.primary};
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




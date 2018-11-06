import next from 'next'
import express, { Request, Response } from 'express'


const PORT = parseInt(process.env.PORT as string, 10) || 3000
const dev = !(new Set(['production', 'test'])).has( process.env.NODE_ENV || '' ) 

const app = next({dev}) 
const handle = app.getRequestHandler()

app.prepare()
.then(() => {
    const server = express()

    // REGISTER CLEAN URLs
    const pages : { [ page : string ] : { masked :string, params : Array<string> } } = {
        // ⚡ ️1. Add masked URLs here 
        '/example' : { 
            masked : '/example/:param1/:param2', 
            params : ['param1', 'param2']    
        },
    }
    Object.keys(pages).map( page  => {
        server.get(pages[page].masked, (req : Request , res : Response ) => {
            const actualPage = page
            const queryParams : { [paramName:string] : string } = {}
            pages[page].params.map( param => { queryParams[param]=req.params[param] } )
            app.render(req, res, actualPage, queryParams)
        })
    })

    // REGISTER HANDLER
    server.get('*', (req  : Request , res: Response) => {
        return handle(req, res)
    })
    
    // START LISTENING
    server.listen(PORT, (err : Error) => {
        if (err) throw err
        console.log(`🚀  Ready on http://localhost:${PORT}`)
        // TODO: notify slack server is up
    })

})
.catch((ex : Error) => {
    console.error(ex.stack)
    process.exit(1)
    // FIXME: notify slack of error
})

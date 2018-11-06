let env = {}

switch(process.env.NODE_ENV) {
    case 'production':
        env = {
            ENV_NAME : 'prod', 
            API_BASE : ''
        }
        break
    case 'dev':
    default:
        env = {
            ENV_NAME : 'dev',
            API_BASE : 'http://localhost:8000'
        }
}

exports.module = env

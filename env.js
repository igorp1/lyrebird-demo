let env = {}

switch(process.env.NODE_ENV) {
    case 'production':
        env = {
            ENV_NAME : 'prod',
            LYREBIRD_CLIENT_ID : process.env.LYREBIRD_CLIENT
        }
        break
    case 'dev':
    default:
        env = {
            ENV_NAME : 'dev',
            LYREBIRD_CLIENT_ID : process.env.LYREBIRD_CLIENT,
            LYREBIRD_REDIRECT_URI : 'http://localhost:3000/auth',
            AUTH_STATE : 'wX3mIWzPJj'
        }
}

exports.module = env

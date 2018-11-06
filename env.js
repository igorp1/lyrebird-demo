let env = {}

switch(process.env.NODE_ENV) {
    case 'production':
        env = {
            ENV_NAME : 'prod'
        }
        break
    case 'dev':
    default:
        env = {
            ENV_NAME : 'dev'
        }
}

exports.module = env

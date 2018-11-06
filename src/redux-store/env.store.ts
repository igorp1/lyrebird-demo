import getConfig from 'next/config'
const { publicRuntimeConfig : {module: ENV_VARS } } = getConfig()

// DEFAULT STATE
export const EnvStoreDefaultState = {
    env : ENV_VARS
}


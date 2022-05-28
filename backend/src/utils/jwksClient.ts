import Axios from 'axios'
import { certToPEM } from './certToPEM';
import { createLogger } from './logger';

export class JwKsClient {
    constructor(jwksUrl, kid) {
        this.jwksUrl = jwksUrl
        this.kid = kid
        this.logger = createLogger('JwKsClient')
    }
    jwksUrl
    kid
    logger

    getJwks = async () => {
        try {
            // this.logger.info('Checking the jwksUrl', { jwksUrl: this.jwksUrl })
            return await Axios.get(this.jwksUrl)
        } catch (error) {
            console.log('error', error)
        }
    }

    returnSigningKeys = (keys) => {
        // this.logger.info('Checking the signing keys', { keys })
        if (!keys || !keys.length) {
            throw new Error('Invalid keys array')
        }

        const signingKeys = keys
            .filter(key => key.use === 'sig' // JWK property `use` determines the JWK is for signing
                && key.kty === 'RSA' // We are only supporting RSA
                && key.kid           // The `kid` must be present to be useful for later
                && key.x5c && key.x5c.length // Has useful public keys (we aren't using n or e)
            ).map(key => {
                return { kid: key.kid, nbf: key.nbf, publicKey: certToPEM(key.x5c[0]) };
            });

        // Returns all of the available signing keys.
        return signingKeys;
    };

    getSigningKey = (keys) => {
        const signingKey = keys.find(key => key.kid === this.kid);
        return signingKey
    }

    getCert = async () => {
        let cert

        const jwks = await this.getJwks()
        // this.logger.info('Checking the jwks in getCert', { jwks: jwks.data.keys })
        if (jwks.data && jwks.data.keys) {

            const signingKeys = this.returnSigningKeys(jwks.data.keys)
            if (signingKeys) {
                const signingKey = this.getSigningKey(signingKeys)
                if (signingKey) {
                    cert = signingKey.publicKey
                }
            }
        } else {
            throw new Error('Invalid Jwks data')
        }

        return cert
    }
}




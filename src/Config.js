import { AuthorizationServiceConfiguration } from '@openid/appauth';

// const Config = {
//   client_id: 'Ih_hLXePZxqfSfwxBLeqynAFLfka',
//   redirect_url: 'http://localhost:3000/redirect.html',
//   logout_url: 'https://identity.us.to/oidc/logout',
//   epConfig: {
//     authorization_endpoint: 'https://identity.us.to/oauth2/authorize',
//     token_endpoint: 'https://identity.us.to/oauth2/token',
//     revocation_endpoint: 'https://identity.us.to/oauth2/revoke',
//     userinfo_endpoint: 'https://identity.us.to/oauth2/userinfo'
//   }
// };
const getConfig = (config) => {
  return { ...config, epConfig: new AuthorizationServiceConfiguration(config.epConfig) }
}
export default getConfig;
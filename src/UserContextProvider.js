import React, { useReducer, useEffect } from 'react';
import {
    AuthorizationRequest,
    AuthorizationNotifier,
    RedirectRequestHandler,
    BaseTokenRequestHandler,
    TokenRequest,
    GRANT_TYPE_AUTHORIZATION_CODE,
    FetchRequestor,
    DefaultCrypto
} from '@openid/appauth';
import { Base64 } from 'js-base64';
import UserContext from './UserContext';
import { getConfig } from './Config'
import './UserContextProvider.css';

const reducer = (state, action) => {
    switch (action.type) {
        case 'login':
            console.log('Logging in ....');
            return {
                ...state,
                isUserLoggedIn: true,
                user: action.payload.subject,
                token: action.payload.idToken
            };
        case 'logout':
            sessionStorage.clear();
            window.location.assign(action.payload.logout_url);
            return { ...state, isUserLoggedIn: false, user: '' };
        default:
            return state;
    };
};


const UserContextProvider = ({ ...props }) => {
    const Config = getConfig(props.config);
    const initialUserContext = { isUserLoggedIn: false, user: '' };
    const [userContext, dispatch] = useReducer(reducer, initialUserContext);
    useEffect(() => {
        let isLoggedIn = sessionStorage.getItem('isLoggedIn');
        if (isLoggedIn) {
            const subject = sessionStorage.getItem('subject');
            dispatch({ type: 'login', payload: { subject: subject, err: false } });
        } else {
            let authzhandler = new RedirectRequestHandler();
            let code = '';
            let pkce_params = {};
            authzhandler.completeAuthorizationRequest()
                .then(res => {
                    if (res) {
                        code = res.response.code;
                        pkce_params = res.request.internal;
                        let subject = '';
                        let tokenHandler = new BaseTokenRequestHandler(new FetchRequestor());
                        let tokenRequest = new TokenRequest({
                            client_id: Config.client_id,
                            redirect_uri: Config.redirect_url,
                            grant_type: GRANT_TYPE_AUTHORIZATION_CODE,
                            code: code,
                            refresh_token: undefined,
                            extras: pkce_params
                        });
                        tokenHandler.performTokenRequest(Config.epConfig, tokenRequest)
                            .then(res => {
                                if (res) {
                                    const idToken = res.idToken;
                                    const jwtPayload = Base64.decode(res.idToken.split('.')[1]);
                                    subject = JSON.parse(jwtPayload).sub;
                                    console.log('ID token', subject);
                                    sessionStorage.setItem('isLoggedIn', true);
                                    sessionStorage.setItem('subject', subject);
                                    dispatch({ type: 'login', payload: { subject: subject, idToken: idToken, err: false } });
                                }
                            });
                        console.log("Getting authz code from constructor")
                    }
                });
        }
    }, []);

    const handleLogin = () => {
        let authNotifier = new AuthorizationNotifier();
        let authzhandler = new RedirectRequestHandler();
        let code = '';
        authzhandler.setAuthorizationNotifier(authNotifier);
        authNotifier.setAuthorizationListener((req, res, err) => {
            console.log('Authorization request complete ', req, res, err);
            code = res.code;
        });
        let request = new AuthorizationRequest({
            client_id: Config.client_id,
            redirect_uri: Config.redirect_url,
            scope: 'openid',
            response_type: AuthorizationRequest.RESPONSE_TYPE_CODE,
            state: undefined
        });

        authzhandler.performAuthorizationRequest(Config.epConfig, request);
        console.log("Authz code is", code);
    };
    return (
        <UserContext.Provider value={{
            ...userContext, handleLogin: () => {
                handleLogin();
            }, handleLogout: () => {
                dispatch({ type: 'logout', payload: { "logout_url": `${Config.logout_url}?id_token_hint=${state.token}&post_logout_redirect_uri=${Config.redirect_url}&state=${new DefaultCrypto().generateRandom(5)}` } });
            }
        }}>
            {userContext.isUserLoggedIn ? props.children : <div className="container-wrapper"> <button className='lg-btn' onClick={handleLogin} type='button'>Login here</button></div>}
        </UserContext.Provider>
    );
};
export default UserContextProvider;
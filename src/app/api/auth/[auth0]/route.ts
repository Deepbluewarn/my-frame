import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        authorizationParams: {
            prompt: 'login',
        }
    }),
    signup: handleLogin({
        authorizationParams: { screen_hint: 'signup' }
    })
});
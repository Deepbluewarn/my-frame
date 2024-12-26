import { handleAuth, handleLogin } from '@auth0/nextjs-auth0';

export const GET = handleAuth({
    login: handleLogin({
        authorizationParams: {
            prompt: 'login',
            baseURL: process.env.AUTH0_BASE_URL,
        }
    }),
    signup: handleLogin({
        authorizationParams: { screen_hint: 'signup' }
    })
});
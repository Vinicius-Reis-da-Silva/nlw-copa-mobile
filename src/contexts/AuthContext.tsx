// Aqui onde ira se trabalha com o contexto da app 
// onde havera a entapa de autenticação do dados do usuário
import { createContext, ReactNode, useState, useEffect } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';


// props dos dados do usuário 
interface UserProps {
    name: string;
    avatarUrl: string;
}

// compartilhamento dos dados do usuário
export interface AuthContextDataProps {
    user: UserProps;
    signIn: () => Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

// criando o contexto e seu valor inicial
export const AuthContext = createContext({} as AuthContextDataProps);

export function AuthContextProvider({ children }: AuthProviderProps) {
    // Estodo dos dados do usuário
    const [user, setUser] = useState<UserProps>({} as UserProps)
    // Estado para verifica se autiticação está ocorrendo
    const [isUserLoading, setIsUserLoading] = useState(false);

    // Etapa de autenticação no acesso no google cloud
    // pegar as requesição, a resposta e as funções atraves do promtAsync
    const [request, response, promptAsync] =  Google.useAuthRequest({
        clientId: '954654895243-1k11l65sb5p76qnmoenrqjdq9b2ci6ei.apps.googleusercontent.com',
        redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
        scopes: ['profile', 'email']
    })

    // função do processo de autenticação
    async function signIn() {4
        console.log('Vamos logar!');
        try {
            console.log('Setou!!!')
            setIsUserLoading(true);
            await promptAsync();
        } catch (error) {
            console.log(error);
            throw error;
        } finally {
            setIsUserLoading(false);
        }
    }

    async function signInWithGoogle(access_token: string) {
        console.log("TOKEN DE AUTENTICAÇÃO ===>", access_token)
    }

    // função quando o componente e rederizado
    useEffect(() => {
        if(response?.type === 'success' && response.authentication?.accessToken){
            signInWithGoogle(response.authentication.accessToken);
        }
    }, [response]);

    return (
        <AuthContext.Provider value={{
            signIn,
            user: {
                name: 'Vinicius Reis da Silva',
                avatarUrl: 'https://github.com/Vinicius-Reis-da-Silva.png'
            }
        }}>
            {children}
        </AuthContext.Provider>
    );
}
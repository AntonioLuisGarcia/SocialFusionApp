export interface StrapiUser{
    id: number,
    username:string,
    email: string
}

export interface StrapiLoginPayload{
    identifier:string,
    password:string
}

export interface StrapiRegisterPayload{
    name:string,
    username:string,
    email:string,
    password:string,
}

export interface StrapiLoginResponse{
    jwt:string,
    user:StrapiUser
}

export interface StrapiRegisterResponse{
    jwt:string,
    user:StrapiUser
}

export interface StrapiExtendedUser{
    name:string,
    username:string,
    user_id:number,
    picture?:string
}
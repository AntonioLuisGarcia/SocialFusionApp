export interface UserExtended{
    id:number,
    name:string,
    username:string,
    email:string,
    password:string,
    description?:string,
    img?:string,
}

export interface UserBasicInfo{
    username:string,
    img?:string,
}
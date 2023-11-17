export interface Post{
    img?:string,
    description:string,
    date: string,
}

export interface PostExtended{
    id:number,
    userId:number,
    img?:string,
    description:string,
    date: string,
}
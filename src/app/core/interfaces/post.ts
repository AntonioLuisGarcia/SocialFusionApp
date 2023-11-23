export interface Post{
    img:string | undefined | null,
    description:string,
    userId:number
}

export interface PostExtended{
    id:number,
    userId:number,
    img?:string,
    description:string,
    date: string,
}
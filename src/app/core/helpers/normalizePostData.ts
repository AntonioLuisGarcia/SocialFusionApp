import { UserExtended } from "../interfaces/User";
import { PostExtended } from "../interfaces/post";

export function normalizePostData(apiResponse: any, currentUser: UserExtended, like:any): PostExtended {
    let post: PostExtended;

    if (apiResponse.attributes) {
      // Si la respuesta viene de Strapi y tiene un formato anidado
      post = {
        id: apiResponse.id,
        description: apiResponse.attributes.description,
        date: apiResponse.attributes.createdAt,
        img: apiResponse.attributes.image?.data?.attributes.url,
        user: {
          id: apiResponse.user?.id || currentUser.id,
          username: currentUser.username, // Usa el nombre de usuario del usuario actual
          name: currentUser.name,
        },
        likedByUser: like
      };
    } else {
      // Si la respuesta ya está en el formato plano esperado
      post = {
        ...apiResponse,
        user: apiResponse.user || {
          id: currentUser.id,
          username: currentUser.username,
          name: currentUser.name,
        },
        likedByUser: like // Mantén el estado del "like" si ya viene incluido
      };
    }
  
    return post;
  }
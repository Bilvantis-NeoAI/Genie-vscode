// export let BASE_API="http://localhost:2000";
export let BASE_API='http://34.46.36.105:3000';
export let ANSWER_CONFIG="chroma"
export let GITKB_BASE_API="http://34.46.36.105:3001";
export let KB_BASE_API="http://18.61.253.240:9000";

export const exchangeUrl= (userUrl: string) =>
{
    BASE_API = userUrl;
}
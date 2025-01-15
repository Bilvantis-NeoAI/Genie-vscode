export let BASE_API="http://localhost:2000";
// export let BASE_API='http://34.46.36.105:3000';
export let ANSWER_CONFIG="chroma"

export const exchangeUrl= (userUrl: string) =>
{
    BASE_API = userUrl;
}
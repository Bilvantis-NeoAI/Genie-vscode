export let BASE_API="http://localhost:2000";
export let ANSWER_CONFIG="chroma"
export let GITKB_BASE_API="http://localhost:9000";
export let KB_BASE_API="http://18.61.64.220:9000";

export const exchangeUrl= (userUrl: string) =>
{
    BASE_API = userUrl;
}
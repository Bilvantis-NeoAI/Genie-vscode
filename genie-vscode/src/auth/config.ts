// export let BASE_API='http://34.46.36.105:3000/app';
export let BASE_API='http://mongo.hsbc-12432649-codephase-dev.dev.gcp.cloud.in.hsbc.:3000/app';
export let ANSWER_CONFIG="chroma";

export const exchangeUrl= (userUrl: string) =>
{
    BASE_API = userUrl;
};
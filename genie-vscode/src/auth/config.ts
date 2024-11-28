export let BASE_API="http://localhost:2000";

export const exchangeUrl= (userUrl: string) =>
{
    BASE_API = userUrl;
}
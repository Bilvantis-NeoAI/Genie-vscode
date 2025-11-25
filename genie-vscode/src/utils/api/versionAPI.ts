import axios from "axios";
import * as dotenv from "dotenv";
import * as https from "https";
import path from "path";
import { getGitToken } from "../../auth/config";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

export async function fetchLatestVersion() {
    const GHE_TOKEN = getGitToken();
    console.log("Using GHE TOKEN", GHE_TOKEN);

    const GHE_API_URL = "https://api.github.com/repos/Jagannath173/vsix_version/releases/latest";

    if (!GHE_TOKEN || !GHE_API_URL) {
        throw new Error("Missing GHE_TOKEN or GHE_API_URL");
    }

    console.log("Testing Github Enterprise API token authentication...");
    console.log("API URL:", GHE_API_URL);
    console.log("GHE_TOKEN:", GHE_TOKEN);

    try {
        const response = await axios.get(GHE_API_URL, {
            headers: {
                Authorization: `Bearer ${GHE_TOKEN}`,
                Accept: "application/vnd.github+json",
            },
            httpsAgent: new https.Agent({
                rejectUnauthorized: false,
            }),
        });

        const latestVersion = response.data?.tag_name || response.data?.name;
        console.log("Latest version fetched from GitHub API:", latestVersion);
        if (!latestVersion) {
            throw new Error("No tag name or name found in GitHub API response");
        }
        return latestVersion.startsWith("v") ? latestVersion.slice(1) : latestVersion;
    } catch (error: any) {
        console.error("Error fetching latest version", error.message);
        throw error;
    }
}

export async function fetchStaticGitToken(): Promise<{ git_token: string }> {
    const STATIC_TOKEN = process.env.STATIC_GIT_TOKEN;
    console.log("returning static token:", STATIC_TOKEN);
    if (!STATIC_TOKEN) {
        throw new Error("STATIC_GIT_TOKEN environment variable is not set");
    }
    return { git_token: STATIC_TOKEN };
}

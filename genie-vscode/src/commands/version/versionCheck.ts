import * as vscode from "vscode";
import { fetchLatestVersion } from "../../utils/api/versionAPI";
import { showUpdateWebview } from "../webview/update_webview/showUpdateWebview";

export async function checkExtensionVersion(context: vscode.ExtensionContext): Promise<boolean> {
    try {
        const extensionId = "HSBC.genie-vscode-hsbc";
        const ext = vscode.extensions.getExtension(extensionId);
        const localVersionRaw = ext?.packageJSON?.version;
        console.log("[versionCheck] localVersionRaw:", localVersionRaw, "typeof:", typeof localVersionRaw);

        const latestRaw = await fetchLatestVersion();
        console.log("[versionCheck] latestRaw:", latestRaw, "typeof:", typeof latestRaw);

        const localVersion = normalizeVersion(localVersionRaw);
        const latestVersion = normalizeVersion(latestRaw);
        console.log("[versionCheck] normalized → local:", localVersion, "latest:", latestVersion);

        if (!localVersion || !latestVersion) {
            console.warn("[versionCheck] Missing version information. Skipping check.");
            return true;
        }

        if (isVersionOutdated(localVersion, latestVersion)) {
            const accepted = await showUpdateWebview(context, localVersion, latestVersion);
            if (accepted) {
                await vscode.env.openExternal(
                    vscode.Uri.parse("https://github.com/Jagannath173/vsix_version/releases")
                );
                return true;
            } else {
                await context.globalState.update("versionRejected", localVersion);
                return true;
            }
        } else {
            await context.globalState.update("versionRejected", undefined);
            return true;
        }

    } catch (err: any) {
        console.error("[versionCheck] failed:", err?.message || err);
        return true;
    }
}

function normalizeVersion(v: any): string | null {
    if (!v && v !== 0) {
        return null;
    }
    if (typeof v === "string") {
        const s = v.trim();
        if (!s) {
            return null;
        }
        return s.replace(/^v/i, "");
    }

    if (typeof v === "number") {
        return String(v);
    }

    if (typeof v === "object") {
        if (v?.tag_name) { return String(v.tag_name).trim().replace(/^v/i, ""); }
        if (v?.name) { return String(v.name).trim().replace(/^v/i, ""); }
        if (v?.data && (v.data.tag_name || v.data.name)) {
            return String(v.data.tag_name || v.data.name).trim().replace(/^v/i, "");
        }
        return JSON.stringify(v);
    }

    return null;
}

function isVersionOutdated(local: string, remote: string): boolean {
    if (typeof local !== "string" || typeof remote !== "string") {
        console.error("[isVersionOutdated] invalid types:", typeof local, typeof remote);
        return false;
    }

    const toNums = (s: string) =>
        s.split(".").map(p => parseInt((p || "0").replace(/[^\d]/g, ""), 10) || 0);

    const [l1, l2, l3] = toNums(local);
    const [r1, r2, r3] = toNums(remote);

    if (r1 > l1) { return true; }
    if (r1 === l1 && r2 > l2) { return true; }
    if (r1 === l1 && r2 === l2 && r3 > l3) { return true; }

    return false;
}
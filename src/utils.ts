import axios from "axios";
import * as vscode from "vscode";
import * as fs from "fs";

export async function getAccessToken() {
    const refreshToken = getRefreshToken();
    if (refreshToken === undefined) {
        return;
    }
    try {
        const { data: { accessToken } } = await axios.post("https://api.unmock.io:443/token/access", {refreshToken});
        return accessToken;
    } catch {
        return;  // How do we want to handle errors here?
    }
}

export function verifyFileIsBodyJson(filepath: string) {
    // Returns file contents if it is a valid json for a body response
    // Returns undefined otherwise
    const fileContents = fs.readFileSync(filepath, 'utf-8');
    try {
        const parsedContent = JSON.parse(fileContents);
        if (parsedContent["unmock-hash"] !== undefined) {
            return; // This is a headers file -- we don't **really** care about that...
        }
        return fileContents;
    } catch {
        return;
    }
}

function getRefreshToken(): string | undefined {
    const config = vscode.workspace.getConfiguration("unmock");
    return config.refreshToken;
}

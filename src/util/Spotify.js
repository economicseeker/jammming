const clientId = 'your-access-id'; // Replace with your real client ID
const redirectUri = 'http://127.0.0.1:3000/';
let accessToken;

function generateRandomString(length) {
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from(crypto.getRandomValues(new Uint8Array(length)))
        .map((x) => possible.charAt(x % possible.length))
        .join('');
}

async function generateCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode(...new Uint8Array(digest)))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

const Spotify = {
    async getAccessToken() {
        if (accessToken) return accessToken;

        const currentUrl = window.location.href;
        const hasCode = currentUrl.includes('?code=');

        if (!hasCode) {
            const codeVerifier = generateRandomString(128);
            const codeChallenge = await generateCodeChallenge(codeVerifier);

            sessionStorage.setItem('code_verifier', codeVerifier);

            const state = generateRandomString(16);
            const scope = 'playlist-modify-public playlist-modify-private';

            const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
                scope
            )}&redirect_uri=${encodeURIComponent(
                redirectUri
            )}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

            window.location = authUrl;
            return;
        } else {
            const code = new URLSearchParams(window.location.search).get('code');
            const codeVerifier = sessionStorage.getItem('code_verifier');

            const body = new URLSearchParams({
                client_id: clientId,
                grant_type: 'authorization_code',
                code: code,
                redirect_uri: redirectUri,
                code_verifier: codeVerifier,
            });

            try {
                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body.toString(),
                });

                if (!response.ok) {
                    throw new Error('Token request failed');
                }

                const data = await response.json();
                accessToken = data.access_token;

                // Clean URL (remove ?code=...)
                window.history.pushState({}, null, '/');

                return accessToken;
            } catch (error) {
                console.error('Error fetching access token:', error);
            }
        }
    },
};

export default Spotify;

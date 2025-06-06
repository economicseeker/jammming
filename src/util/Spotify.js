const clientId = 'fcba5185329348e7b8c352738ee55e28';
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
            try {
                const codeVerifier = generateRandomString(128);
                const codeChallenge = await generateCodeChallenge(codeVerifier);

                // Store code verifier in session storage
                sessionStorage.setItem('code_verifier', codeVerifier);
                console.log('Stored code verifier:', codeVerifier);

                const state = generateRandomString(16);
                const scope = 'playlist-modify-public playlist-modify-private';

                const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${clientId}&scope=${encodeURIComponent(
                    scope
                )}&redirect_uri=${encodeURIComponent(
                    redirectUri
                )}&state=${state}&code_challenge_method=S256&code_challenge=${codeChallenge}`;

                console.log('Redirecting to auth URL:', authUrl);
                window.location = authUrl;
                return;
            } catch (error) {
                console.error('Error in authorization setup:', error);
                throw error;
            }
        } else {
            try {
                const code = new URLSearchParams(window.location.search).get('code');
                const codeVerifier = sessionStorage.getItem('code_verifier');

                console.log('Retrieved code verifier:', codeVerifier);

                if (!codeVerifier) {
                    console.error('No code verifier found in session storage');
                    // Clear any existing session data
                    sessionStorage.clear();
                    // Redirect to start the auth flow again
                    window.location = '/';
                    return;
                }

                const body = new URLSearchParams({
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: redirectUri,
                    code_verifier: codeVerifier,
                });

                console.log('Requesting token with params:', {
                    client_id: clientId,
                    grant_type: 'authorization_code',
                    redirect_uri: redirectUri,
                    code_verifier_length: codeVerifier.length
                });

                const response = await fetch('https://accounts.spotify.com/api/token', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: body.toString(),
                });

                const responseText = await response.text();
                console.log('Token response:', {
                    status: response.status,
                    statusText: response.statusText,
                    body: responseText
                });

                if (!response.ok) {
                    throw new Error(`Token request failed: ${response.status} ${response.statusText} - ${responseText}`);
                }

                const data = JSON.parse(responseText);
                accessToken = data.access_token;

                // Clean URL (remove ?code=...)
                window.history.pushState({}, null, '/');

                return accessToken;
            } catch (error) {
                console.error('Error fetching access token:', error);
                // Clear the code verifier on error
                sessionStorage.clear();
                throw error;
            }
        }
    },

    async search(term) {
        try {
            const token = await this.getAccessToken();
            const response = await fetch(`https://api.spotify.com/v1/search?type=track&q=${encodeURIComponent(term)}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                const errorData = await response.text();
                console.error('Search request failed:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorData
                });
                throw new Error('Search request failed');
            }

            const data = await response.json();
            return data.tracks.items.map(track => ({
                id: track.id,
                name: track.name,
                artist: track.artists[0].name,
                album: track.album.name,
                uri: track.uri
            }));
        } catch (error) {
            console.error('Error searching tracks:', error);
            throw error;
        }
    },

    async savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) return;

        try {
            const token = await this.getAccessToken();
            const headers = { Authorization: `Bearer ${token}` };
            let userId;

            // Get user ID
            const userResponse = await fetch('https://api.spotify.com/v1/me', {
                headers: headers
            });
            if (!userResponse.ok) {
                throw new Error('Failed to get user ID');
            }
            const userData = await userResponse.json();
            userId = userData.id;

            // Create playlist
            const createResponse = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: name
                })
            });
            if (!createResponse.ok) {
                throw new Error('Failed to create playlist');
            }
            const playlistData = await createResponse.json();

            // Add tracks to playlist
            const addTracksResponse = await fetch(`https://api.spotify.com/v1/playlists/${playlistData.id}/tracks`, {
                method: 'POST',
                headers: {
                    ...headers,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    uris: trackUris
                })
            });
            if (!addTracksResponse.ok) {
                throw new Error('Failed to add tracks to playlist');
            }
        } catch (error) {
            console.error('Error saving playlist:', error);
            throw error;
        }
    }
};

export default Spotify;

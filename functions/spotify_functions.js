const axios = require('axios');
const API_URL = "https://api.spotify.com/v1";
// Fields for access token
const token_endpoint = 'https://accounts.spotify.com/api/token';
const token_auth = Buffer.from(`9710de3b2d984376b1c85005c5fb5358:640bf47ba9c1479e97926174da22ff28`).toString('base64');

class SpotifySession {
    constructor(token) {
        this.token = token;
    }
    static async open() {
        const response = await axios.post(token_endpoint, null, {
            params: {
                grant_type: 'client_credentials'
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${token_auth}`
            }
        });
        return new SpotifySession(response.data.access_token);
    }
    get(url, params) {
        return axios.get(url, {
            params: params || {},
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }
    post(url, data, params) {
        return axios.post(url, data, {
            params: params || {},
            headers: {
                Authorization: `Bearer ${this.token}`
            }
        });
    }
}
/**
 * Gets the URL from a track
 * @param title track
 * @param artist track
 */
exports.getTrackUrl = async (title, artist) => {
    const session = await SpotifySession.open();
    return session.get(`${API_URL}/search`, {
        q: title,
        type: 'track',
        market: 'ES'
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(`Status ${response.status}`);
        }
        const data = response.data.tracks.items;
        if (!data) {
            throw new Error("Track not found");
        }
        const track = data.find(_track => _track.artists.find(_artist => _artist.name.includes(artist)));
        const url = track ? track.external_urls.spotify : data[0].external_urls.spotify;
        if (!url) {
            throw new Error("Url not found!");
        }
        return url;
    });
};
/**
 * Gets the URL for an artist
 * @param artist
 */
exports.getArtistUrl = async (artist) => {
    const session = await SpotifySession.open();
    return session.get(`${API_URL}/search`, {
        q: artist,
        type: 'artist',
        market: 'ES'
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(`Status ${response.status}`);
        }
        const data = response.data.artists.items;
        if (!data) {
            throw new Error("Track not found");
        }
        const url = data[0].external_urls.spotify;
        if (!url) {
            throw new Error("Url not found!");
        }
        return url;
    });
};
/**
 * Gets the URL for an artist image
 * @param artist
 */
exports.getArtistImageUrl = async (artist) => {
    const session = await SpotifySession.open();
    return session.get(`${API_URL}/search`, {
        q: artist,
        type: 'artist',
        market: 'ES'
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(`Status ${response.status}`);
        }
        const data = response.data.artists.items;
        if (!data) {
            throw new Error("Track not found");
        }
        const image = data[0].images[0];
        if (!image) {
            throw new Error("Track not found");
        }
        const url = image.url;
        if (!url) {
            throw new Error("Url not found!");
        }
        return url;
    });
};

exports.getTracksByGenre = async (genre) => {
    const session = await SpotifySession.open();
    return session.get(`${API_URL}/search`, {
        q: `genre:${genre}`,
        type: 'track',
        market: 'ES'
    }).then(response => {
        if (response.status !== 200) {
            throw new Error(`Status ${response.status}`);
        }
        const tracks = response.data['tracks']['items'];
        return tracks;
    });
};

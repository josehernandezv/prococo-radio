import queryString from 'query-string';

export function logInWithSpotify() {
    let clientId = '9638f8f3c3574c82b9b92e1003f7f8b9';
    let uri = window.location.origin;
    let redirectUri = uri.concat('/');
    const scopes = [
        'streaming',
        'user-read-birthdate',
        'user-read-private',
        'user-modify-playback-state',
        'user-read-email',
    ];

    let query =
        'https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'token',
            client_id: clientId,
            scope: scopes.join(' '),
            redirect_uri: redirectUri,
            state: [...Array(16)]
                .map(() => Math.random().toString(36)[3])
                .join(''),
            show_dialog: 'false',
        });
    window.location = query;
}

export function checkUrlForSpotifyAccessToken() {
    const params = getHashParams();
    const accessToken = params.access_token;
    if (!accessToken) {
        return false;
    } else {
        return accessToken;
    }
}

export function getHashParams() {
    let hashParams = window.location.hash
        .substring(1)
        .split('&')
        .reduce(function (initial, item) {
            if (item) {
                var parts = item.split('=');
                initial[parts[0]] = decodeURIComponent(parts[1]);
            }
            return initial;
        }, {});
    return hashParams;
}

export function playTrackFromPlaylist(token, deviceId, playlistId, uri) {
    fetch('https://api.spotify.com/v1/me/player/play?device_id=' + deviceId, {
        method: 'PUT',
        headers: {
            authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            context_uri: 'spotify:playlist:' + playlistId,
            offset: {
                uri: uri,
            },
        }),
    });
}

import queryString from 'query-string';

export function logInWithSpotify() {
    let clientId = "9638f8f3c3574c82b9b92e1003f7f8b9";
    let uri = window.location.origin;
    let redirectUri = uri.concat("/");
    const scopes = [
        'streaming',
        'user-read-birthdate',
        'user-read-private',
        'user-modify-playback-state',
        'user-read-email'
    ];

    let query = 'https://accounts.spotify.com/authorize?' +
        queryString.stringify({
            response_type: 'token',
            client_id: clientId,
            scope: scopes.join(' '),
            redirect_uri: redirectUri,
            state: generateRandomString(16),
            show_dialog: 'false'
        });

    window.location = query;
}

export function checkUrlForSpotifyAccessToken() {
    const params = getHashParams();
    const accessToken = params.access_token
    if (!accessToken) {
        return false
    } else {
        return accessToken
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
    console.log(hashParams);
    return hashParams;
}

function generateRandomString(length) {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}
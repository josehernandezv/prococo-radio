import * as React from 'react';

const noop = () => {};

export function useSpotifyWebPlaybackSdk({
    name,
    getOAuthToken,
    accountError = noop,
    onReady = noop,
    onPlayerStateChanged = noop,
}) {
    const [isReady, setIsReady] = React.useState(false);
    const [deviceId, setDeviceId] = React.useState('');
    const playerRef = React.useRef(null);

    React.useEffect(() => {
        if (window.Spotify) {
            playerRef.current = new window.Spotify.Player({
                name,
                getOAuthToken: async (cb) => {
                    const token = await getOAuthToken();
                    cb(token);
                },
            });
            setIsReady(true);
        }

        window.onSpotifyWebPlaybackSDKReady = () => {
            playerRef.current = new window.Spotify.Player({
                name,
                getOAuthToken: async (cb) => {
                    const token = await getOAuthToken();
                    cb(token);
                },
            });
            setIsReady(true);
        };

        if (!window.Spotify) {
            const scriptTag = document.createElement('script');
            scriptTag.src = 'https://sdk.scdn.co/spotify-player.js';

            document.head.appendChild(scriptTag);
        }
    }, [getOAuthToken, name]);

    const handleReady = React.useCallback(
        ({ device_id: readyDeviceId }) => {
            setDeviceId(readyDeviceId);

            if (onReady) {
                onReady(deviceId);
            }
        },
        [deviceId, onReady]
    );

    React.useEffect(() => {
        if (isReady) {
            playerRef.current.connect();
        }
    }, [isReady]);

    React.useEffect(() => {
        const player = playerRef.current;
        if (isReady) {
            player.addListener('account_error', accountError);
            player.addListener('ready', handleReady);
            player.addListener('initialization_error', accountError);
            player.addListener('authentication_error', accountError);
            player.addListener('not_ready', accountError);
            player.addListener('player_state_changed', onPlayerStateChanged);

            return () => {
                player.removeListener('account_error', accountError);
                player.removeListener('ready', handleReady);
                player.removeListener(
                    'player_state_changed',
                    onPlayerStateChanged
                );
            };
        }

        return;
    }, [accountError, handleReady, isReady, onPlayerStateChanged]);

    return {
        player: playerRef.current,
        deviceId,
        isReady,
    };
}

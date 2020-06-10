import { useEffect, useRef } from 'react';

const useBeforeunload = (handler = () => {}) => {
    const handlerRef = useRef(handler);

    useEffect(() => {
        handlerRef.current = handler;
    }, [handler]);

    useEffect(() => {
        const handleBeforeunload = (event) => {
            let returnValue;

            if (typeof handlerRef.current === 'function') {
                returnValue = handlerRef.current(event);
            }

            if (event.defaultPrevented) {
                event.returnValue = '';
            }

            if (typeof returnValue === 'string') {
                event.returnValue = returnValue;
                return returnValue;
            }
        };

        window.addEventListener('beforeunload', handleBeforeunload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeunload);
        };
    }, []);
};

export default useBeforeunload;

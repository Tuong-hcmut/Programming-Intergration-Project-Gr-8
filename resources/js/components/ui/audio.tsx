import * as React from 'react';
import { useEffect, useRef } from 'react';

export const Audio = ({
    audioUrl,
    ...props
}: React.HTMLAttributes<HTMLAudioElement> & {
    audioUrl?: string;
}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.load();
        }
    }, [audioUrl]);

    return (
        <audio ref={audioRef} src={audioUrl} {...props} controls>
            Your browser does not support the audio element.
        </audio>
    );
};

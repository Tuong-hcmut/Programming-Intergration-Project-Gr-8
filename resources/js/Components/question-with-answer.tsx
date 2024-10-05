import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Check, Mic, Square } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { LiveAudioVisualizer } from 'react-audio-visualize';
import { route } from 'ziggy-js';

export function QuestionWithAnswer({
    question,
}: {
    question: App.Models.Question;
}) {
    const { post: postAnswer, setData: setAnswerData } = useForm<{
        answerAudio: Blob | null;
    }>({
        answerAudio: null,
    });

    const [isRecording, setIsRecording] = useState(false);
    const [recordingStartTime, setRecordingStartTime] = useState<number | null>(
        null,
    );
    const [recordingTime, setRecordingTime] = useState(0);
    const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
    const [transcript, setTranscript] = useState('');
    const [usedCueWords, setUsedCueWords] = useState<string[]>([]);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const streamRef = useRef<MediaStream | null>(null);

    const audioUrl = audioBlob ? URL.createObjectURL(audioBlob) : null;

    const MAX_RECORDING_TIME = 300; // 5 minutes in seconds

    const submitAudio = () =>
        post(`/question/${question.id}/answer`, {
            data: {
                answerAudio: audioBlob,
            },
            forceFormData: true,
        });

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                if (recordingStartTime) {
                    const currentTime = Date.now();
                    const elapsedTime =
                        (currentTime - recordingStartTime) / 1000;
                    setRecordingTime(elapsedTime);
                }
            }, 100);
        }
        return () => clearInterval(interval);
    }, [isRecording, recordingStartTime]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: true,
            });
            streamRef.current = stream;
            mediaRecorderRef.current = new MediaRecorder(stream);
            audioChunksRef.current = [];

            audioContextRef.current = new AudioContext();

            mediaRecorderRef.current.ondataavailable = (event) => {
                audioChunksRef.current.push(event.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: 'audio/wav',
                });
                setAudioBlob(audioBlob);

                if (streamRef.current) {
                    const tracks = streamRef.current.getTracks();
                    tracks.forEach((track) => track.stop());
                    streamRef.current = null;
                }

                if (audioContextRef.current) {
                    audioContextRef.current.close();
                    audioContextRef.current = null;
                }
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setRecordingStartTime(Date.now());
            setRecordingTime(0);

            timeoutRef.current = setTimeout(() => {
                stopRecording();
            }, MAX_RECORDING_TIME * 1000);
        } catch (error) {
            console.error('Error accessing microphone:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
            setRecordingStartTime(null);
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }

            setAnswerData('answerAudio', audioBlob);
        }
    };

    const simulateTranscription = (blob: Blob) => {
        setTimeout(() => {
            const transcriptText =
                "Recently, I had the opportunity to participate in a local tennis tournament. It was an intense competition, with some really skilled opponents. The matches were tough, but after several rounds of hard-fought games, I made it to the final. In that last match, I was up against the defending champion, who had a reputation for being incredibly fast and tactical on the court. The game was incredibly challenging, but I stayed focused and determined. Throughout the tournament, I had kept my mind on two things: giving my best and showing good sportsmanship. Even when things didn't go my way, I respected my opponents and the game, which really helped me stay grounded. In the end, I managed to win the final match and claim the title of champion! It was a thrilling moment, but what I really achieved after that was a sense of personal growth. The tournament reminded me of the importance of perseverance and respect in competition, and those lessons are just as valuable as the trophy itself.";
            setTranscript(transcriptText);

            const usedWords = question.cue_words.filter((word) =>
                new RegExp(`\\b${word}s?\\b`, 'i').test(transcriptText),
            );
            setUsedCueWords(usedWords);
        }, 2000);
    };

    const highlightCueWords = (text: string) => {
        let highlightedText = text;
        question.cue_words.forEach((word) => {
            const regex = new RegExp(`\\b${word}s?\\b`, 'gi');
            highlightedText = highlightedText.replace(
                regex,
                (match) =>
                    `<span class="bg-green-200 underline">${match}</span>`,
            );
        });
        return { __html: highlightedText };
    };

    const getTimeColor = () => {
        const ratio = recordingTime / MAX_RECORDING_TIME;
        if (ratio >= 0.8) return 'text-red-500';
        if (ratio >= 0.66) return 'text-yellow-500';
        return 'text-gray-700';
    };

    return (
        <Card className="mx-auto w-full max-w-3xl space-y-6 p-6">
            <h2 className="text-balance text-center text-2xl font-bold">
                {question.text}
            </h2>

            <div className="flex flex-wrap justify-center gap-2">
                {question.cue_words.map((word) => {
                    const isWordUsed = usedCueWords.includes(word);

                    return (
                        <Badge
                            key={word}
                            variant={isWordUsed ? 'success' : 'secondary'}
                            className={cn(
                                isWordUsed && 'bg-green-500 text-white',
                                'flex items-center gap-1',
                            )}
                        >
                            {word}
                            {isWordUsed && <Check className="h-3 w-3" />}
                        </Badge>
                    );
                })}
            </div>

            <div className="flex flex-col items-center space-y-4">
                <Button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`flex h-16 w-16 items-center justify-center rounded-full ${
                        isRecording
                            ? 'bg-red-500 hover:bg-red-600'
                            : 'bg-primary hover:bg-primary/90'
                    }`}
                >
                    {isRecording ? (
                        <Square className="h-6 w-6 animate-pulse text-white" />
                    ) : (
                        <Mic className="h-6 w-6 text-white" />
                    )}
                </Button>
                {isRecording && (
                    <LiveAudioVisualizer
                        mediaRecorder={mediaRecorderRef.current!}
                        width={200}
                        height={75}
                        barColor={'rgb(23, 23, 23)'}
                    />
                )}
                <div
                    className={`text-center font-mono text-lg ${getTimeColor()}`}
                >
                    {Math.floor(recordingTime / 60)}:
                    {(Math.floor(recordingTime) % 60)
                        .toString()
                        .padStart(2, '0')}{' '}
                    / 5:00
                </div>
            </div>

            {audioUrl && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Audio Playback</h3>
                    <div className="flex items-center gap-3">
                        <audio controls className="w-full">
                            <source src={audioUrl} type="audio/wav" />
                            Your browser does not support the audio element.
                        </audio>
                        <Button onClick={() => postAnswer(route())}>
                            Submit
                        </Button>
                    </div>
                </div>
            )}

            {transcript && (
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold">Transcript</h3>
                    <p
                        className="text-sm text-gray-600"
                        dangerouslySetInnerHTML={highlightCueWords(transcript)}
                    ></p>
                </div>
            )}
        </Card>
    );
}

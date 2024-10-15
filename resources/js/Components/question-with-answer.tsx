import { Audio } from '@/Components/ui/audio';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { FieldErrorMessage } from '@/Components/ui/form';
import { useTimer } from '@/lib/useTimer';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { Check, Mic, Square } from 'lucide-react';
import { useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';

export function QuestionWithAnswer({
    question,
    answer,
}: {
    question: App.Models.Question;
    answer?: App.Models.Answer;
}) {
    const {
        post: postAnswer,
        setData: setAnswerData,
        errors,
        clearErrors,
        reset,
    } = useForm<{
        answerAudio: File;
    }>();

    const [transcript, setTranscript] = useState('');
    const [usedCueWords, setUsedCueWords] = useState<string[]>([]);
    const stopRecordingTimeout = useRef<NodeJS.Timeout | null>(null);

    const MAX_RECORDING_TIME = 300; // 5 minutes in seconds

    const { startTimer, stopTimer, resetTimer, minutes, seconds } = useTimer();

    const {
        status,
        startRecording,
        stopRecording,
        mediaBlobUrl,
        clearBlobUrl,
    } = useReactMediaRecorder({
        audio: true,
        video: false,
        onStart: () => {
            // Stop when the time is up
            stopRecordingTimeout.current = setTimeout(
                () => stopRecording(),
                MAX_RECORDING_TIME * 1000,
            );
            resetTimer();
            startTimer();
        },
        onStop: (_, blob) => {
            const file = new File([blob], 'recording.webm', {
                type: 'audio/webm',
            });
            setAnswerData('answerAudio', file);
            simulateTranscription();

            if (stopRecordingTimeout.current) {
                clearTimeout(stopRecordingTimeout.current);
            }
            stopTimer();
        },
    });

    const isRecording = status === 'recording';

    const simulateTranscription = () => {
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
        const ratio = (minutes * 60 + seconds) / MAX_RECORDING_TIME;
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
                    onClick={() => {
                        if (isRecording) {
                            stopRecording();
                        } else {
                            clearBlobUrl();
                            startRecording();
                        }
                    }}
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
                <div
                    className={`text-center font-mono text-lg ${getTimeColor()}`}
                >
                    {minutes}:{seconds.toString().padStart(2, '0')} / 5:00
                </div>
            </div>

            {mediaBlobUrl && (
                <div className="space-y-2">
                    <div className="grid grid-cols-[1fr_min-content] grid-rows-[1fr_min-content] items-center gap-x-3 gap-y-1">
                        <Audio audioUrl={mediaBlobUrl} className="w-full" />
                        <Button
                            onClick={() => {
                                clearErrors();
                                postAnswer(
                                    route('answer.create', {
                                        question: question.id,
                                    }),
                                    {
                                        onSuccess: () => {
                                            clearBlobUrl();
                                            reset();
                                        },
                                    },
                                );
                            }}
                        >
                            Submit
                        </Button>
                        <FieldErrorMessage>
                            {errors.answerAudio}
                        </FieldErrorMessage>
                    </div>
                </div>
            )}

            {answer && (
                <section className="space-y-4">
                    <div className="flex items-center gap-[1ch]">
                        <h3 className="text-xl font-semibold">Answer</h3>
                        <p className="text-sm text-gray-600">
                            by {answer.user?.name}
                        </p>
                    </div>

                    <Audio audioUrl={answer.audio_link} className="w-full" />

                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold">Transcript</h4>
                        {transcript ? (
                            <p
                                className="text-sm text-gray-600"
                                dangerouslySetInnerHTML={highlightCueWords(
                                    transcript,
                                )}
                            ></p>
                        ) : (
                            <p className="text-sm text-gray-600">
                                Transcription is being processed...
                            </p>
                        )}
                    </div>
                </section>
            )}
        </Card>
    );
}

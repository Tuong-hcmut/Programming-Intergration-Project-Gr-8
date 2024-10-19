import { Audio } from '@/Components/ui/audio';
import { Badge } from '@/Components/ui/badge';
import { Button } from '@/Components/ui/button';
import { Card } from '@/Components/ui/card';
import { FieldErrorMessage } from '@/Components/ui/form';
import { useTimer } from '@/lib/useTimer';
import { cn, secondsToTime } from '@/lib/utils';
import { Answer, Question } from '@/types/models';
import { useForm } from '@inertiajs/react';
import { Check, Mic, Square } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { useReactMediaRecorder } from 'react-media-recorder';
import { stemmer } from 'stemmer';

export function QuestionWithAnswer({
    question,
    answer,
}: {
    question: Question;
    answer?: Answer;
}) {
    const answerForm = useForm<{
        answerAudio: File | null;
    }>({
        answerAudio: null,
    });
    const postAnswer = () => {
        answerForm.clearErrors();
        answerForm.post(
            route('answer.create', {
                question: question.id,
            }),
            {
                onSuccess: () => {
                    clearBlobUrl();
                    answerForm.reset();
                },
                forceFormData: true,
            },
        );
    };

    const stopRecordingTimeout = useRef<NodeJS.Timeout | null>(null);
    const [showAnswerOnly, setShowAnswerOnly] = useState(!!answer);

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
            answerForm.setData('answerAudio', file);

            if (stopRecordingTimeout.current) {
                clearTimeout(stopRecordingTimeout.current);
            }
            stopTimer();
        },
    });

    const isRecording = status === 'recording';

    const handleUploadRecording = () => {
        // Request user to choose a file
        if (!document.querySelector('input#answer-audio')) {
            const input = document.createElement('input');
            input.id = 'answer-audio';
            input.type = 'file';
            input.accept = 'audio/*';
            input.onchange = async (event) => {
                let fileInput = event.target as HTMLInputElement;
                const file = fileInput.files?.[0];

                if (file) {
                    answerForm.setData('answerAudio', file);
                }

                // Clear files
                fileInput.value = '';
            };
            input.style.display = 'none';
            document.body.appendChild(input);
        }

        (
            document.querySelector(
                'input#answer-audio',
            ) as HTMLInputElement | null
        )?.click();
    };

    const stemmedCueWords = useMemo(() => {
        return question.cue_words.map(stemmer);
    }, [question.cue_words]);

    const { highlightedTranscript, usedCueWords } = useMemo(() => {
        let highlightedTranscript = answer?.transcript || '';
        const usedCueWords = new Set();

        if (answer?.transcript) {
            for (const match of highlightedTranscript.match(/\b\w+\b/g) || []) {
                const stemmedMatch = stemmer(match.toLowerCase());
                if (stemmedCueWords.includes(stemmedMatch)) {
                    highlightedTranscript = highlightedTranscript.replace(
                        new RegExp(`\\b${match}\\b`, 'gi'),
                        `<span class="bg-green-200 underline">${match}</span>`,
                    );
                    usedCueWords.add(match);
                }
            }
        }

        return { highlightedTranscript, usedCueWords };
    }, [answer?.transcript, stemmedCueWords]);

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
                    const isWordUsed = usedCueWords.has(word);

                    return (
                        <Badge
                            key={word}
                            variant={isWordUsed ? 'success' : 'secondary'}
                            className={cn('flex items-center gap-1')}
                        >
                            {word}
                            {isWordUsed && <Check className="h-3 w-3" />}
                        </Badge>
                    );
                })}
            </div>

            {showAnswerOnly ? (
                <div className="w-full text-center">
                    <Button onClick={() => setShowAnswerOnly(false)}>
                        Attempt
                    </Button>
                </div>
            ) : (
                <>
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
                            {minutes}:{seconds.toString().padStart(2, '0')} /{' '}
                            {secondsToTime(MAX_RECORDING_TIME)}
                        </div>

                        <div className="space-y-1 text-center text-sm text-muted-foreground">
                            <p>Already recorded? Upload your answer here</p>
                            <div className="space-x-[1ch]">
                                <Button
                                    size="sm"
                                    onClick={handleUploadRecording}
                                >
                                    Choose file
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={postAnswer}
                                    disabled={!answerForm.data.answerAudio}
                                >
                                    Upload
                                </Button>
                            </div>
                            <p>{answerForm.data.answerAudio?.name}</p>
                        </div>
                    </div>

                    {mediaBlobUrl && (
                        <div className="space-y-2">
                            <div className="grid grid-cols-[1fr_min-content] grid-rows-[1fr_min-content] items-center gap-x-3 gap-y-1">
                                <Audio
                                    audioUrl={mediaBlobUrl}
                                    className="w-full"
                                />
                                <Button onClick={postAnswer}>Submit</Button>;
                                <FieldErrorMessage>
                                    {answerForm.errors.answerAudio}
                                </FieldErrorMessage>
                                ;
                            </div>
                        </div>
                    )}
                </>
            )}

            {answer && (
                <section className="space-y-4">
                    <div className="flex items-center gap-[1ch]">
                        <h3 className="text-xl font-semibold">Answer</h3>
                        <p className="text-sm text-muted-foreground">
                            by {answer.user?.name}
                        </p>
                    </div>

                    <Audio audioUrl={answer.audio_link} className="w-full" />

                    <div className="space-y-2">
                        <h4 className="text-lg font-semibold">Transcript</h4>
                        {answer.transcript ? (
                            <p
                                className="text-sm text-muted-foreground"
                                dangerouslySetInnerHTML={{
                                    __html: highlightedTranscript,
                                }}
                            ></p>
                        ) : (
                            <p className="text-sm text-muted-foreground">
                                Transcription is being processed...
                            </p>
                        )}
                    </div>
                </section>
            )}
        </Card>
    );
}

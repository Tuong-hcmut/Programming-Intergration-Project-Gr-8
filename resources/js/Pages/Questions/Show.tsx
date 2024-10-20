import { QuestionWithAnswer } from '@/components/question-with-answer';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Answer, Question } from '@/types/models';
import { Head } from '@inertiajs/react';

export default function QuestionsShow({
    question,
    answers,
}: {
    question: Question;
    answers: Answer[];
}) {
    return (
        <Authenticated>
            <Head title="Welcome" />

            <QuestionWithAnswer question={question} answers={answers} />
        </Authenticated>
    );
}

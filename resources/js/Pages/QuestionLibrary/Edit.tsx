import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { FieldDescription, InertiaFormField } from '@/components/ui/form';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { preventDefaultFormSubmit } from '@/lib/utils';
import { Link, router, useForm } from '@inertiajs/react';
import { SaveIcon } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

function EditQuestionModal({
    questionLibrary,
    question,
    children,
}: PropsWithChildren<{
    questionLibrary: App.Models.QuestionLibrary;
    question?: App.Models.Question;
}>) {
    const [open, setOpen] = useState(false);
    const action = question ? 'Edit' : 'Create';
    const form = useForm({
        question_library_id: questionLibrary.id,
        text: '',
        cue_words: [],
        ...(question || {}),
    });

    const submit = preventDefaultFormSubmit(() => {
        if (question) {
            form.patch(route('question.update', question.id), {
                onSuccess: () => {
                    toast('Question updated!');
                    form.reset();
                    setOpen(false);
                },
            });
        } else {
            form.post(route('question.store'), {
                onSuccess: () => {
                    toast('Question created!');
                    form.reset();
                    setOpen(false);
                },
            });
        }
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle className="mb-3">
                            {action} question
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-3">
                        <InertiaFormField
                            form={form}
                            fieldName="text"
                            displayName="Question text"
                        />
                        <InertiaFormField
                            form={form}
                            fieldName="cue_words"
                            toDisplay={(value) => value.join(',')}
                            toValue={(value) =>
                                value
                                    .split(',')
                                    .map((v) => v.trim())
                                    .filter(Boolean)
                            }
                            displayName="Cue words (separated by commas)"
                        />
                        <FieldDescription>
                            Cue words: {form.data.cue_words.join(', ')} (
                            {form.data.cue_words.length} words)
                        </FieldDescription>
                    </div>

                    <DialogFooter>
                        <Button loading={form.processing}>
                            <SaveIcon className="!size-5" />
                            {action}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}

export default function Edit({
    question_library,
    questions,
    editable,
}: {
    question_library: App.Models.QuestionLibrary;
    questions: App.Models.Question[];
    editable: boolean;
}) {
    const form = useForm(question_library);

    const updateLibrary = preventDefaultFormSubmit(() => {
        form.patch(route('question-library.update', question_library.uuid), {
            onSuccess: () => {
                toast('Question library updated!');
            },
        });
    });

    return (
        <Authenticated header={question_library.title}>
            <Card className="max-w-constrained mx-auto">
                <CardContent>
                    {editable ? (
                        <form
                            className="flex w-full items-end gap-3"
                            onSubmit={updateLibrary}
                        >
                            <InertiaFormField
                                form={form}
                                fieldName="title"
                                displayName="Title"
                                className="w-full"
                            />

                            <Button>Update</Button>
                        </form>
                    ) : (
                        <div className="text-xl font-bold">
                            {question_library.title}
                        </div>
                    )}

                    <div className="mt-5 flex flex-col gap-3">
                        <div className="text-xl font-bold">
                            Questions (total: {questions.length})
                        </div>
                        {questions.map((question) => (
                            <div
                                key={question.id}
                                className="flex items-start justify-between hover:bg-muted"
                            >
                                <div>
                                    <div>{question.text}</div>
                                    <div className="flex gap-1">
                                        {question.cue_words.map((word) => (
                                            <Badge
                                                key={word}
                                                variant="secondary"
                                                className="shadow"
                                            >
                                                {word}
                                            </Badge>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-1">
                                    <Link
                                        href={route(
                                            'question.show',
                                            question.id,
                                        )}
                                        className={buttonVariants({
                                            size: 'sm',
                                        })}
                                    >
                                        Attempt
                                    </Link>

                                    {editable && (
                                        <>
                                            <EditQuestionModal
                                                questionLibrary={
                                                    question_library
                                                }
                                                question={question}
                                            >
                                                <Button size="sm">Edit</Button>
                                            </EditQuestionModal>

                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() =>
                                                    router.delete(
                                                        route(
                                                            'question.delete',
                                                            question.id,
                                                        ),
                                                    )
                                                }
                                            >
                                                Delete
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </div>
                        ))}
                        {editable && (
                            <EditQuestionModal
                                questionLibrary={question_library}
                            >
                                <Button className="mt-5 w-min">Add</Button>
                            </EditQuestionModal>
                        )}
                    </div>
                </CardContent>
            </Card>
        </Authenticated>
    );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { InertiaFormField } from '@/components/ui/form';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import { Link, useForm } from '@inertiajs/react';
import { PlusIcon } from 'lucide-react';
import { PropsWithChildren, useState } from 'react';
import { toast } from 'sonner';

function CreateLibraryDialog({ children }: PropsWithChildren) {
    const form = useForm({
        title: '',
    });
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create new question library</DialogTitle>
                </DialogHeader>

                <div className="space-y-3">
                    <InertiaFormField
                        form={form}
                        fieldName="title"
                        displayName="Question library title"
                    />
                </div>

                <DialogFooter>
                    <Button
                        loading={form.processing}
                        onClick={() =>
                            form.post(route('question-library.store'), {
                                onSuccess: () => {
                                    toast(
                                        `Created new question library: ${form.data.title}`,
                                    );
                                    setOpen(false);
                                },
                            })
                        }
                    >
                        <PlusIcon className="!size-5" />
                        Create
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export default function Index({
    question_libraries,
}: {
    question_libraries: App.Models.QuestionLibrary[];
}) {
    return (
        <Authenticated header="Question library">
            <div className="max-w-constrained mx-auto grid grid-cols-[repeat(auto-fill,minmax(15rem,1fr))] gap-2">
                {question_libraries.map((library) => (
                    <Link
                        key={library.uuid}
                        href={route('question-library.edit', {
                            id: library.uuid,
                        })}
                    >
                        <Card>
                            <CardContent>
                                <div className="mb-3 text-lg font-bold">
                                    {library.title}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {library.questions_count} questions
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>

            <CreateLibraryDialog>
                <Button className="fixed bottom-5 right-5">Create</Button>
            </CreateLibraryDialog>
        </Authenticated>
    );
}

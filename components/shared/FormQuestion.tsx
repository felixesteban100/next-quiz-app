"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormField,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs";
import { createQuestion, updateQuestion, deleteQuestion } from "@/lib/actions/questions.actions"
import { QUESTION_DIFFICULTIES, QUESTION_TYPES } from "@/lib/constants"
import { WithId } from "mongodb"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
// import { useRouter } from "next/navigation"
import CustomFormItem from "./CustomFormItem"


const formSchema = z.object({
    question: z.string({
        required_error: "You need to type a question type.",
    }),
    type: z.string({
        required_error: "You need to select a type of question.",
    }),
    correct_answer: z.string({
        required_error: "You need to type the correct answer.",
    }),
    incorrect_answers: z.string({
        required_error: "You need to type at least 1 incorrect answers type.",
    }).array().nonempty(),
    category: z.string({
        required_error: "You need to select a category.",
    }),
    difficulty: z.string({
        required_error: "You need to select a difficulty.",
    }),
    image_url: z.string({
        required_error: "You need to type an image url.",
    }).url()
})

type FormQuestionProps = {
    categories: WithId<Category>[] | undefined
    question: string | undefined,
    type: string | undefined,
    correct_answer: string | undefined,
    incorrect_answers: string[] | undefined,
    category: string | undefined,
    difficulty: string | undefined/* 'easy' | 'normal' | 'hard' */,
    image_url: string | undefined,
    selectedQuestionId: string;
    FormAction: FormAction;
}

export default function FormQuestion({ categories, category, correct_answer, difficulty, image_url, incorrect_answers, question, type, selectedQuestionId, FormAction }: FormQuestionProps) {
    const { user } = useUser()
    // const router = useRouter()

    const defaultValues = {
        question: question,
        type: type,
        correct_answer: correct_answer,
        incorrect_answers: incorrect_answers,
        category: category,
        difficulty: difficulty,
        image_url: image_url,
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        if (!user || !user.id) return toast("Can't submit form cause user is not logged in", {
            description: JSON.stringify(values)
        })

        switch (FormAction) {
            case 'create':
                try {
                    const questionInserted: Question = { ...values, createdBy: user.id, createdAt: new Date(), updatedAt: new Date() }
                    const questionCreated = await createQuestion(questionInserted)

                    if (questionCreated === "This question already exists") {
                        toast.warning("Question repeated", {
                            description: JSON.stringify(questionCreated),
                            duration: 10000,
                            className: "text-3xl"
                        })
                    } else {
                        toast.success("Success", {
                            description: JSON.stringify(questionCreated),
                            duration: 10000,
                            className: "text-3xl"
                        })
                        // form.reset(defaultValues)
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened creating question! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000,
                        className: "text-3xl"
                    })
                }
                break;

            case 'update':
                try {
                    const questionInserted = { ...values, updatedAt: new Date() }
                    if (Object.entries(defaultValues).toString() !== Object.entries(values).toString()) {
                        const questionUpdated = await updateQuestion(questionInserted, selectedQuestionId)

                        if (questionUpdated) {
                            toast.success("Success", {
                                description: JSON.stringify(questionUpdated),
                                duration: 10000,
                                className: "text-3xl"
                            })
                            // form.reset(defaultValues)
                        } else {
                            toast.warning("Question trouble", {
                                description: JSON.stringify(questionUpdated),
                                duration: 10000,
                                className: "text-3xl"
                            })
                        }
                    } else {
                        toast.warning("Question trouble", {
                            description: JSON.stringify(["No changes were made"]),
                            duration: 10000,
                            className: "text-3xl"
                        })
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened updating question! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000,
                        className: "text-3xl"
                    })
                }
                break;

            case 'delete':
                try {
                    const questionDeleted = await deleteQuestion(selectedQuestionId)

                    if (questionDeleted) {
                        toast.success("Success", {
                            description: JSON.stringify(questionDeleted),
                            duration: 10000,
                            className: "text-3xl"
                        })
                        // form.reset(defaultValues)
                    } else {
                        toast.warning("Question warning", {
                            description: JSON.stringify(questionDeleted),
                            duration: 10000,
                            className: "text-3xl"
                        })
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened deleting question! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000,
                        className: "text-3xl"
                    })
                }
                break;
        }
    }

    if (FormAction === 'delete') {
        return (
            <AlertDialog>
                <div className="flex justify-center items-center w-full">
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="text-3xl p-10">Delete Question</Button>
                    </AlertDialogTrigger>
                </div>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-xl">Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col justify-start items-start gap-5">
                            <p className="text-3xl">Question: <span className="font-bold">{question}</span></p>
                            <p className="text-xl">This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.</p>
                            {/* <code className="text-wrap">
                                {JSON.stringify(form.getValues(), undefined, 2)}
                            </code> */}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            onSubmit({ ...form.getValues() })
                        }} >Continue</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        )
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center w-full">
                <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                        <CustomFormItem
                            label="Question"
                            description="This is your public display name."
                            formControlChildren={<Textarea placeholder="Type the question here..." {...field} />}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <CustomFormItem
                            label="Type of question"
                            description="You can manage the question type here"
                            formControlChildren={null}
                            fieldType="select"
                            select={{
                                onChange: (value) => {
                                    field.onChange(value)
                                    form.resetField('correct_answer')
                                    form.resetField('incorrect_answers')
                                },
                                placeholder: "Select a type",
                                defaultValue: field.value,
                                options: QUESTION_TYPES.map(c => ({ name: c.name, key: c.value, value: c.value }))
                            }}
                        />
                    )}
                />
                {form.getValues().type === "multiple" &&
                    <FormField
                        control={form.control}
                        name="correct_answer"
                        render={({ field }) => (
                            <CustomFormItem
                                label="Correct answer"
                                description="You can manage the question type here"
                                formControlChildren={<Input placeholder="Type the correct answer here..." {...field} />}
                                fieldType="children"
                            />
                        )}
                    />
                }
                {form.getValues().type === "boolean" &&
                    <FormField
                        control={form.control}
                        name="correct_answer"
                        render={({ field }) => (
                            <CustomFormItem
                                label="Correct answer"
                                description="You can manage the question type here"
                                formControlChildren={null}
                                fieldType="radio"
                                radio={{
                                    options: [{
                                        key: 'true',
                                        name: "True",
                                        value: 'true'
                                    },
                                    {
                                        key: 'false',
                                        name: "False",
                                        value: 'false'
                                    }],
                                    onValueChange: (value) => {
                                        field.onChange(value)
                                        form.setValue("incorrect_answers", [`${!(value === "true")}`])
                                    },
                                    defaultValue: field.value
                                }}
                            />
                        )}
                    />
                }
                {form.getValues().type === "multiple" &&
                    <FormField
                        control={form.control}
                        name="incorrect_answers"
                        render={({ field }) => (
                            <CustomFormItem
                                label="Incorrect answers"
                                description="You can manage the question type here"
                                formControlChildren={
                                    <>
                                        <Input className="text-3xl py-7" key={"incorrect_answers-0"} placeholder="Type 1st incorrect answer here..." {...field} value={form.getValues("incorrect_answers")[0]} onChange={(event) => form.setValue('incorrect_answers', [event.target.value, form.getValues("incorrect_answers")[1], form.getValues("incorrect_answers")[2]])} />
                                        <Input className="text-3xl py-7" key={"incorrect_answers-1"} placeholder="Type 2nd incorrect answer here..." {...field} value={form.getValues("incorrect_answers")[1]} onChange={(event) => form.setValue('incorrect_answers', [form.getValues("incorrect_answers")[0], event.target.value, form.getValues("incorrect_answers")[2]])} />
                                        <Input className="text-3xl py-7" key={"incorrect_answers-2"} placeholder="Type 3rd incorrect answer here..." {...field} value={form.getValues("incorrect_answers")[2]} onChange={(event) => form.setValue('incorrect_answers', [form.getValues("incorrect_answers")[0], form.getValues("incorrect_answers")[1], event.target.value])} />
                                    </>
                                }
                                fieldType="children"
                            />
                        )}
                    />}

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <CustomFormItem
                            label="Category"
                            description="You can manage the question type here"
                            formControlChildren={null}
                            fieldType="select"
                            select={{
                                placeholder: "Select a category",
                                options: categories ? categories.map(c => ({
                                    name: c.name,
                                    value: c.name,
                                    key: c.id.toString()
                                })) : [],
                                defaultValue: field.value,
                                onChange: field.onChange
                            }}
                        />

                    )}
                />
                <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                        <CustomFormItem
                            label="Difficulty"
                            description="You can manage the question type here"
                            formControlChildren={null}
                            fieldType="select"
                            select={{
                                placeholder: "Select a difficulty",
                                options: QUESTION_DIFFICULTIES.map(c => ({
                                    name: c.name,
                                    value: c.name,
                                    key: c.value
                                })),
                                defaultValue: field.value,
                                onChange: field.onChange
                            }}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <CustomFormItem
                            label="Image link (source)"
                            description="This is your public display name."
                            formControlChildren={<Input placeholder="Type the image url..." {...field} />}
                            fieldType="children"
                        />
                    )}
                />
                <div className="flex items-center justify-center gap-5">
                    <Button className="text-3xl py-7" type="submit">Submit</Button>
                    {/* <Button type="button" variant={"outline"} onClick={() => form.reset(defaultValues)}>Reset</Button> */}
                    {/* <Button type="button" variant={"outline"} onClick={() => router.refresh()}>Reset</Button> */}
                </div>
            </form>
        </Form>
    )

}
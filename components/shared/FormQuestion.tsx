"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { useUser } from "@clerk/nextjs";
import { createQuestion, updateQuestion, deleteQuestion } from "@/lib/actions/questions.actions"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
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
import { useRouter } from "next/navigation"


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
    const router = useRouter()

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
                            duration: 10000
                        })
                    } else {
                        toast.success("Success", {
                            description: JSON.stringify(questionCreated),
                            duration: 10000
                        })
                        // form.reset(defaultValues)
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened creating question! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000
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
                                duration: 10000
                            })
                            // form.reset(defaultValues)
                        } else {
                            toast.warning("Question trouble", {
                                description: JSON.stringify(questionUpdated),
                                duration: 10000
                            })
                        }
                    } else {
                        toast.warning("Question trouble", {
                            description: JSON.stringify(["No changes were made"]),
                            duration: 10000
                        })
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened updating question! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000
                    })
                }
                break;

            case 'delete':
                try {
                    const questionDeleted = await deleteQuestion(selectedQuestionId)

                    if (questionDeleted) {
                        toast.success("Success", {
                            description: JSON.stringify(questionDeleted),
                            duration: 10000
                        })
                        // form.reset(defaultValues)
                    } else {
                        toast.warning("Question warning", {
                            description: JSON.stringify(questionDeleted),
                            duration: 10000
                        })
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened deleting question! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000
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
                        <Button variant="outline" /* className="max-w-[800px]" */>Delete Question</Button>
                    </AlertDialogTrigger>
                </div>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col justify-start items-start gap-5">
                            <p className="text-3xl">Question: <span className="font-bold">{question}</span></p>
                            <p>This action cannot be undone. This will permanently delete your
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
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Type the question here..." {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Type of question</FormLabel>
                            <Select onValueChange={(value) => {
                                field.onChange(value)
                                form.resetField('correct_answer')
                                form.resetField('incorrect_answers')
                            }} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {QUESTION_TYPES.map((difficulties: any) => (
                                        <SelectItem key={difficulties.value} value={difficulties.value}>{difficulties.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can manage the question type here
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {form.getValues().type === "multiple" &&
                    <FormField
                        control={form.control}
                        name="correct_answer"
                        render={({ field }) => (
                            <FormItem className="w-full max-w-[800px]">
                                <FormLabel>Correct answer</FormLabel>
                                <FormControl>
                                    <Input placeholder="Type the correct answer here..." {...field} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                }
                {form.getValues().type === "boolean" &&
                    <FormField
                        control={form.control}
                        name="correct_answer"
                        render={({ field }) => (
                            <FormItem className="w-full max-w-[800px]">
                                <FormLabel>Correct answer</FormLabel>
                                <FormControl>
                                    <RadioGroup
                                        onValueChange={(value) => {
                                            field.onChange(value)
                                            form.setValue("incorrect_answers", [`${!(value === "true")}`])
                                        }}
                                        defaultValue={field.value}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="true" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                True
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="false" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                False
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                }
                {form.getValues().type === "multiple" &&
                    <FormField
                        control={form.control}
                        name="incorrect_answers"
                        render={({ field }) => (
                            <FormItem className="w-full max-w-[800px]">
                                <FormLabel>Incorrect answers</FormLabel>
                                <FormControl>
                                    <Input placeholder="Type 1st incorrect answer here..." {...field} value={form.getValues("incorrect_answers")[0]} onChange={(event) => form.setValue('incorrect_answers', [event.target.value, form.getValues("incorrect_answers")[1], form.getValues("incorrect_answers")[2]])} />
                                </FormControl>
                                <FormControl>
                                    <Input placeholder="Type 2nd incorrect answer here..." {...field} value={form.getValues("incorrect_answers")[1]} onChange={(event) => form.setValue('incorrect_answers', [form.getValues("incorrect_answers")[0], event.target.value, form.getValues("incorrect_answers")[2]])} />
                                </FormControl>
                                <FormControl>
                                    <Input placeholder="Type 3rd incorrect answer here..." {...field} value={form.getValues("incorrect_answers")[2]} onChange={(event) => form.setValue('incorrect_answers', [form.getValues("incorrect_answers")[0], form.getValues("incorrect_answers")[1], event.target.value])} />
                                </FormControl>
                                <FormDescription>
                                    This is your public display name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />}

                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {categories?.map((category: any) => (
                                        <SelectItem key={category.id} value={category.name}>{category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can manage the question type here
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a difficulty" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {QUESTION_DIFFICULTIES.map((difficulties: any) => (
                                        <SelectItem key={difficulties.value} value={difficulties.value}>{difficulties.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can manage the question type here
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="image_url"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Image link (source)</FormLabel>
                            <FormControl>
                                <Input placeholder="Type the image url..." {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex items-center justify-center gap-5">
                    <Button type="submit">Submit</Button>
                    {/* <Button type="button" variant={"outline"} onClick={() => form.reset(defaultValues)}>Reset</Button> */}
                    {/* <Button type="button" variant={"outline"} onClick={() => router.refresh()}>Reset</Button> */}
                </div>
            </form>
        </Form>
    )

}
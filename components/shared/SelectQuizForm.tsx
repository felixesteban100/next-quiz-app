"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormField,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { QUESTION_DIFFICULTIES, QUESTION_TYPES } from "@/lib/constants"
import { Button } from "../ui/button"
// import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { WithId } from "mongodb"
import CustomFormItem from "./CustomFormItem"


const formSchema = z.object({
    category: z.string(),
    numberOfQuestions: z.number().min(1).max(50),
    type: z.string(),
    difficulty: z.string()
})

type SelectQuizFormProps = {
    api: string,
    categories: WithId<Category>[] | TriviaCategories | undefined;
}

export default function SelectQuizForm({ api, categories }: SelectQuizFormProps) {
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            category: 'all',
            numberOfQuestions: 3,
            type: 'all',
            difficulty: 'all',
        },
    })

    function onSubmit(values: z.infer<typeof formSchema>) {
        toast.success("let's go", {
            description: JSON.stringify(values),
            className: "text-3xl"
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex flex-col justify-center items-center w-full">

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
                                placeholder: `Select a type`,
                                options: QUESTION_TYPES ? [{ name: 'All', key: 'all', value: 'all' }, ...QUESTION_TYPES.map(c => ({
                                    name: c.name,
                                    value: c.value,
                                    key: c.value
                                }))] : [],
                                defaultValue: field.value,
                                onChange: field.onChange
                            }}
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                        <CustomFormItem
                            label="How many question"
                            description="You can manage the number of questions"
                            formControlChildren={<Input type="number" min={1} max={20} placeholder="How many questions" {...field} /* onChange={(value) => field.onChange(parseInt(value.target.value) < 20 ? parseInt(value.target.value) : field.value)} */ />}
                            fieldType="select"
                        />
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <CustomFormItem
                            label="Category"
                            description="You can manage the question category here"
                            formControlChildren={null}
                            fieldType="select"
                            select={{
                                placeholder: `Select category`,
                                options: categories ? [{ name: 'All', key: 'all', value: 'all' }, ...categories.map(c => ({
                                    name: `${c.id} - ${c.name}`,
                                    value: api === "native" ? c.name : c.id.toString(),
                                    key: c.id.toString()
                                }))] : [],
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
                            description=" You can manage the question difficulty here"
                            formControlChildren={null}
                            fieldType="select"
                            select={{
                                placeholder: `Select a difficulty`,
                                options: [{ name: 'All', key: 'all', value: 'all' }, ...QUESTION_DIFFICULTIES.map(c => ({
                                    name: `${c.name}`,
                                    value: c.value,
                                    key: c.value
                                }))],
                                defaultValue: field.value,
                                onChange: field.onChange
                            }}
                        />
                    )}
                />

                {/* <Link href={`/quiz?category=${form.getValues().category}&type=${form.getValues().type}&numberOfQuestions=${form.getValues().numberOfQuestions}&difficulty=${form.getValues().difficulty}`}> */}
                <Button className="text-3xl p-10" onClick={() => router.replace(`/quiz?api=${api}&category=${form.getValues().category}&type=${form.getValues().type}&numberOfQuestions=${form.getValues().numberOfQuestions}&difficulty=${form.getValues().difficulty}`)} /* type="submit" */>Go to questions</Button>
                {/* </Link> */}
            </form>
        </Form>
    )
}
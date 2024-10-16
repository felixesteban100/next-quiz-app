"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
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

import { QUESTION_DIFFICULTIES, QUESTION_TYPES } from "@/lib/constants"
import { Button } from "../ui/button"
// import Link from "next/link"
import { toast } from "sonner"
import { useRouter } from 'next/navigation'
import { WithId } from "mongodb"


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
            description: JSON.stringify(values)
        })
    }

    console.log(form.getValues('category'))

    const classes = {
        title: "text-3xl",
        field: "text-3xl py-7",
        options: "text-3xl",
        description: "text-xl"
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex flex-col justify-center items-center w-full">

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px] space-y-6">
                            <FormLabel className={`${classes.title}`}>Type of question</FormLabel>
                            <Select onValueChange={(value) => {
                                field.onChange(value)
                            }} defaultValue={field.value}>
                                <FormControl className={`${classes.field}`} >
                                    <SelectTrigger >
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem className={`${classes.options}`} value={'all'}>All</SelectItem>
                                    {QUESTION_TYPES.map((difficulties: any) => (
                                        <SelectItem className={`${classes.options}`} key={difficulties.value} value={difficulties.value}>{difficulties.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription className={`${classes.description}`}>
                                You can manage the question type here
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="numberOfQuestions"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px] space-y-6">
                            <FormLabel className={`${classes.title}`}>How many question</FormLabel>
                            <FormControl className={`${classes.field}`}>
                                <Input type="number" min={1} max={20} placeholder="How many questions" {...field} /* onChange={(value) => field.onChange(parseInt(value.target.value) < 20 ? parseInt(value.target.value) : field.value)} */ />
                            </FormControl>
                            <FormDescription className={`${classes.description}`}>
                                You can manage the number of questions
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px] space-y-6">
                            <FormLabel className={`${classes.title}`}>Category</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className={`${classes.field}`}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem className={`${classes.options}`} value='all'>All</SelectItem>
                                    {categories?.map((category) => (
                                        <SelectItem className={`${classes.options}`} key={category.id} value={api === "native" ? category.name : category.id.toString()}>{category.id} - {category.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription className={`${classes.description}`}>
                                You can manage the question category here
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="difficulty"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px] space-y-6">
                            <FormLabel className={`${classes.title}`}>Difficulty</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl className={`${classes.field}`} >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a difficulty" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem className={`${classes.options}`} value="all">All</SelectItem>
                                    {QUESTION_DIFFICULTIES.map((difficulties: any) => (
                                        <SelectItem className={`${classes.options}`} key={difficulties.value} value={difficulties.value}>{difficulties.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription className={`${classes.description}`}>
                                You can manage the question difficulty here
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {/* <Link href={`/quiz?category=${form.getValues().category}&type=${form.getValues().type}&numberOfQuestions=${form.getValues().numberOfQuestions}&difficulty=${form.getValues().difficulty}`}> */}
                <Button className="text-3xl p-10" onClick={() => router.replace(`/quiz?api=${api}&category=${form.getValues().category}&type=${form.getValues().type}&numberOfQuestions=${form.getValues().numberOfQuestions}&difficulty=${form.getValues().difficulty}`)} /* type="submit" */>Go to questions</Button>
                {/* </Link> */}
            </form>
        </Form>
    )
}
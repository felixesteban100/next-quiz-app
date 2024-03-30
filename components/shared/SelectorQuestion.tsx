"use client"

import Link from "next/link"
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
import { redirect, usePathname } from "next/navigation"
import { WithId } from "mongodb"

const FormSchema = z.object({
    question_id: z
        .string({
            required_error: "Please select an question.",
        })
})

type SelectorQuestionProps = {
    allQuestions: WithId<Question>[] | undefined;
    selectedQuestionInfo: WithId<Question> | undefined | null;
    pageAction: string;
}

export default function SelectorQuestion({ allQuestions, selectedQuestionInfo, pageAction }: SelectorQuestionProps) {
    const pathname = usePathname()

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // redirect(`/update-question?selectedQuestionId${data.question_id}`)
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center w-full">
                <FormField
                    control={form.control}
                    name="question_id"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Questions</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={selectedQuestionInfo?._id.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select a question to ${pageAction}`} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {allQuestions?.map((question) => (
                                        <SelectItem key={question._id.toString()} value={question._id.toString()}>{question.question}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormDescription>
                                You can manage email addresses in your{" "}
                                <Link href="/examples/forms">email settings</Link>.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Link href={`${pathname}?selectedQuestionId=${form.getValues().question_id}`}>
                    <Button>
                        Select question
                    </Button>
                </Link>

                {/* <Button type="submit">Select question</Button> */}
            </form>
        </Form>
    )
}

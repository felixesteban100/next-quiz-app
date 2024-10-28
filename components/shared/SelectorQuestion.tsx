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
import CustomFormItem from "./CustomFormItem"

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

    const classes = {
        title: "text-3xl",
        field: "text-3xl py-7",
        options: "text-3xl",
        description: "text-xl"
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center w-full">
                <FormField
                    control={form.control}
                    name="question_id"
                    render={({ field }) => (
                        <CustomFormItem
                            label="Questions"
                            description="You can manage the question type here"
                            formControlChildren={null}
                            fieldType="select"
                            select={{
                                placeholder: `Select a question to ${pageAction}`,
                                options: allQuestions ? allQuestions.map(c => ({
                                    name: c.question,
                                    value: c._id.toString(),
                                    key: c._id.toString()
                                })) : [],
                                defaultValue: field.value,
                                onChange: field.onChange
                            }}
                        />
                    )}
                />
                <Link href={`${pathname}?selectedQuestionId=${form.getValues().question_id}`}>
                    <Button className="text-3xl p-10">
                        Select question
                    </Button>
                </Link>

                {/* <Button type="submit">Select question</Button> */}
            </form>
        </Form>
    )
}

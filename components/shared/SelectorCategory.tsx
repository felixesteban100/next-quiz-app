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
import { WithId } from "mongodb"
import { usePathname } from "next/navigation"
import CustomFormItem from "./CustomFormItem"

const FormSchema = z.object({
    category_id: z
        .string({
            required_error: "Please select an question.",
        })
})

type SelectorCategoryProps = {
    allCategories: WithId<Category>[] | undefined;
    selectedCategoryInfo: WithId<Category> | undefined | null;
    FormAction: FormAction
}

export default function SelectorCategory({ allCategories, selectedCategoryInfo, FormAction }: SelectorCategoryProps) {
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
                    name="category_id"
                    render={({ field }) => (

                        <CustomFormItem
                            label="Category"
                            description="You can manage the question type here"
                            formControlChildren={null}
                            fieldType="select"
                            select={{
                                placeholder: "Select a Category",
                                options: allCategories ? allCategories.map(c => ({
                                    name: c.name,
                                    value: c._id.toString(),
                                    key: c._id.toString()
                                })) : [],
                                defaultValue: field.value,
                                onChange: field.onChange
                            }}
                        />
                    )}
                />
                <Link href={`${pathname}?selectedCategoryId=${form.getValues().category_id}`}>
                    <Button className="text-3xl p-10">
                        Select category
                    </Button>
                </Link>

            </form>
        </Form>
    )
}

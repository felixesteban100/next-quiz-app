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


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex flex-col justify-center items-center w-full">
                <FormField
                    control={form.control}
                    name="category_id"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Questions</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={selectedCategoryInfo?._id.toString()}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder={`Select a category to ${FormAction}`} />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {allCategories?.map((category) => (
                                        <SelectItem key={category._id.toString()} value={category._id.toString()}>{category.name}</SelectItem>
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
                <Link href={`${pathname}?selectedCategoryId=${form.getValues().category_id}`}>
                    <Button>
                        Select category
                    </Button>
                </Link>

            </form>
        </Form>
    )
}

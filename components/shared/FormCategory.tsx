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
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
// import { WithId } from "mongodb"
import { useUser } from "@clerk/nextjs";
import { createCategory, updateCategory, deleteCategory } from "@/lib/actions/categories.actions"
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


const formSchema = z.object({
    name: z.string({
        required_error: "You write a name.",
    }),
})

type FormCategoryProps = {
    name: string | undefined;
    FormAction: FormAction
    selectedCategoryId: string;
}

export default function FormCategory({ name, FormAction, selectedCategoryId }: FormCategoryProps) {
    const { user } = useUser()

    const defaultValues = {
        name: name
    }

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.

        if (!user || !user.id) return toast("Can't submit form cause user is not logged in", {
            description: JSON.stringify(values)
        })

        switch (FormAction) {
            case 'create':
                try {
                    const categoryInserted: Category = { ...values, createdBy: user.id, createdAt: new Date(), updatedAt: new Date(), id: 0 }
                    const categoryCreated = await createCategory(categoryInserted)

                    if (categoryCreated === "This category already exists") {
                        toast.warning("Question repeated", {
                            description: JSON.stringify(categoryCreated),
                            duration: 10000
                        })
                    } else {
                        toast.success("Success", {
                            description: JSON.stringify(categoryCreated),
                            duration: 10000
                        })
                    }

                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened creating category! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000
                    })
                }
                break;

            case 'update':
                try {
                    const categoryInserted = { ...values, updatedAt: new Date() }
                    if (Object.entries(defaultValues).toString() !== Object.entries(values).toString()) {
                        const categoryUpdated = await updateCategory(categoryInserted, selectedCategoryId)

                        if (categoryUpdated) {
                            toast.success("Success", {
                                description: JSON.stringify(categoryUpdated),
                                duration: 10000
                            })
                        } else {
                            toast.warning("Category warning", {
                                description: JSON.stringify(categoryUpdated),
                                duration: 10000
                            })
                        }
                    } else {
                        toast.warning("Category warning", {
                            description: JSON.stringify(["No changes were made"]),
                            duration: 10000
                        })
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened updating category! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000
                    })
                }
                break;


            case 'delete':
                try {
                    const categoryDeleted = await deleteCategory(selectedCategoryId)

                    if (categoryDeleted) {
                        toast.success("Success", {
                            description: JSON.stringify(categoryDeleted),
                            duration: 10000
                        })
                    } else {
                        toast.warning("Category warning", {
                            description: JSON.stringify(categoryDeleted),
                            duration: 10000
                        })
                    }
                } catch (error) {
                    console.log(error)
                    toast.error("Opps... something happened deleting category! Please try again", {
                        description: JSON.stringify(error),
                        duration: 10000
                    })
                }
                break;
        }
    }

    if (FormAction === 'delete') {
        return (
            <AlertDialog >
                <div className="flex justify-center items-center w-full">
                    <AlertDialogTrigger asChild>
                        <Button variant="outline" /* className="max-w-[800px]" */>Delete Category</Button>
                    </AlertDialogTrigger>
                </div>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col justify-start items-start gap-5">
                            <p className="text-3xl">Category: <span className="font-bold">{name}</span></p>
                            <p>This action cannot be undone. This will permanently delete your
                                account and remove your data from our servers.</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {
                            onSubmit({ name: name ?? "" })
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
                    name="name"
                    render={({ field }) => (
                        <FormItem className="w-full max-w-[800px]">
                            <FormLabel>Category Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Type the category name here..." {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your public display name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    )

}
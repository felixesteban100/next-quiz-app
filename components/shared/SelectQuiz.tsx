

import { getCategories } from "@/lib/actions/categories.actions";
import SelectQuizForm from "./SelectQuizForm";

export default async function SelectQuiz({ api }: { api: string }) {
    const categories = await getCategories()
    const categoriesExternal: CategoryExternal = await fetch('https://opentdb.com/api_category.php').then(res => res.json())

    return (
        <SelectQuizForm api={api} categories={api === "native" ? categories : categoriesExternal.trivia_categories} />
    )
}

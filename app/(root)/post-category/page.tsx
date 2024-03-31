import FormCategory from "@/components/shared/FormCategory";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Create category',
}

export default async function post_category() {

    return (
        <FormCategory name={undefined} FormAction="create" selectedCategoryId={""} />
    )
}
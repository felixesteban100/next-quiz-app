import FormCategory from "@/components/shared/FormCategory";
import SelectorCategory from "@/components/shared/SelectorCategory";
import { getCategoryByIdForUser, getCategoriesByUser } from "@/lib/actions/categories.actions";
import { currentUser } from '@clerk/nextjs';

export default async function update_category({
    searchParams,
}: {
    searchParams?: {
        selectedCategoryId: string,
    }
}) {
    const user = await currentUser();

    if (!user) return <div>Must be logged in to update category</div>

    const selectedCategoryId = searchParams?.selectedCategoryId

    const selectedCategoryInfo = await getCategoryByIdForUser(selectedCategoryId, user.id)

    const allCategories = await getCategoriesByUser(user.id)

    const pageAction = 'update'

    if (allCategories === undefined) return (
        <div className="w-full flex justify-center items-center">
            <p>You don't have categories created</p>
        </div>
    )

    /* if (!selectedCategoryInfo && selectedCategoryId) return <div className="w-full flex justify-center items-center">
        <p>You don't access to that selectedCategoryInfo</p>
    </div> */

    return (
        <div className="w-full">
            {(!selectedCategoryId || selectedCategoryId === 'undefined') && <SelectorCategory
                allCategories={allCategories}
                selectedCategoryInfo={selectedCategoryInfo}
                FormAction={pageAction}
            />}

            {selectedCategoryInfo ?
                <FormCategory
                    FormAction={pageAction}
                    name={selectedCategoryInfo?.name}
                    selectedCategoryId={selectedCategoryInfo._id.toString()}
                />
                :
                <div className="text-center my-10">No category id provided, select a category</div>
            }
        </div>
    )
}
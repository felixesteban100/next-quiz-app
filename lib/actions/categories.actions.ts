"use server"

import { handleError } from "../utils";
import { collectionCategory } from "../database/mongodb";
import { revalidatePath } from "next/cache";
import { ObjectId } from "mongodb";


export async function getCategories() {
    try {
        const categories = await collectionCategory.find({}).toArray()
        // if (!categories) throw new Error("Categories not found");
        return /* JSON.parse(JSON.stringify( */categories/* )) */;
    } catch (error) {
        handleError(error, "getCategories() categories.action");
    }
}

export async function createCategory(category: Category) {
    try {
        const categories = await collectionCategory.find({}).toArray()

        if (categories.some(c => c.name.toLowerCase() === category.name.toLowerCase())) {
            return 'This category already exists'
        }

        const lastCategoryId = categories[categories.length - 1].id

        const categoryCreated = await collectionCategory.insertOne({ ...category, id: lastCategoryId + 1 })
        revalidatePath('/post-question')
        revalidatePath('/update-question')
        revalidatePath('/delete-question')
        revalidatePath('/quiz')

        return JSON.parse(JSON.stringify(categoryCreated));
    } catch (error) {
        handleError(error, "createCategory() categories.action")
    }
}

export async function getCategoryByIdForUser(categoryId: string | undefined, userId: string) {

    if (!categoryId || categoryId === 'undefined') return

    const isIdValid = new RegExp("^[0-9a-fA-F]{24}$").test(categoryId)

    if (!isIdValid) return

    try {
        const categories = await collectionCategory.findOne({ _id: new ObjectId(categoryId), createdBy: userId })
        // if (!categories) throw new Error("Categories not found");
        return /* JSON.parse(JSON.stringify( */categories/* )) */;
    } catch (error) {
        handleError(error, "getCategoryByIdForUser() categories.action");
    }
}

export async function getCategoriesByUser(userId: string) {
    try {
        const categories = await collectionCategory.find({ createdBy: userId }).toArray()
        // if (!categories) throw new Error("Categories not found");
        return /* JSON.parse(JSON.stringify( */categories/* )) */;
    } catch (error) {
        handleError(error, "getCategoriesByUser() categories.action");
    }
}

export async function updateCategory(categoryInserted: Omit<Category, "createdAt" | "createdBy" | "id">, categoryId: string) {
    if (!categoryInserted) return
    try {
        const category = await collectionCategory.findOneAndUpdate({ _id: new ObjectId(categoryId) }, { $set: categoryInserted })
        revalidatePath('/post-question')
        revalidatePath('/update-question')
        revalidatePath('/delete-category')
        revalidatePath('/update-category')
        revalidatePath('/quiz')
        return category

    } catch (error) {
        handleError(error, 'categories.action updateCategory()')
    }
}


export async function deleteCategory(categoryId: string) {
    try {
        const category = await collectionCategory.findOneAndDelete({ _id: new ObjectId(categoryId) })
        revalidatePath('/post-question')
        revalidatePath('/update-question')
        revalidatePath('/delete-category')
        revalidatePath('/update-category')
        revalidatePath('/quiz')
        return category

    } catch (error) {
        handleError(error, 'categories.action updateCategory()')
    }
}
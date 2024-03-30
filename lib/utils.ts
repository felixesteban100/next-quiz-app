import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const handleError = (error: unknown, where: string) => {
  if (error instanceof Error) {
    // This is a native JavaScript error (e.g., TypeError, RangeError)
    console.error(error.message);
    console.log("where", where)
    throw new Error(`Error: ${error.message}`);
  } else if (typeof error === "string") {
    // This is a string error message
    console.error(error);
    console.log("where", where)
    throw new Error(`Error: ${error}`);
  } else {
    // This is an unknown type of error
    console.error(error);
    console.log("where", where)
    throw new Error(`Unknown error: ${JSON.stringify(error)}`);
  }
};

export async function getQueryOptions(
  category: string,
  type: string,
  difficulty: string,
) {
  const queryOptions: QueryOptions = {};

  if (category !== "all") queryOptions["category"] = category;
  if (type !== "all") queryOptions["type"] = type;
  if (difficulty !== "all") queryOptions["difficulty"] = difficulty;

  return queryOptions;
}
import { ReactNode } from "react";
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";

type CustomFormItemProps = {
    label: string;
    description: string;
    fieldType?: 'children' | "select" | 'radio';
    select?: {
        options: { name: string; value: string, key: string }[];
        placeholder: string;
        defaultValue: string;
        onChange: (...event: any[]) => void;
    },
    radio?: {
        options: { name: string; value: string, key: string }[];
        onValueChange: (...event: any[]) => void; // maybe to be changed
        defaultValue: string;
    }
    formControlChildren: ReactNode | JSX.Element[];
}

export default function CustomFormItem({ fieldType = "children", description, formControlChildren, label, select, radio }: CustomFormItemProps) {
    const classes = {
        title: "text-3xl",
        field: "text-3xl py-7",
        options: "text-3xl",
        description: "text-xl"
    }

    return (
        <FormItem className="w-full max-w-[800px] space-y-6">
            <FormLabel className={`${classes.title}`}>{label}</FormLabel>
            <FormControl className={`${fieldType === 'radio' ? 'text-3xl' : classes.field}`}>
                {(select && fieldType === "select") ? (
                    <Select onValueChange={select.onChange} defaultValue={select.defaultValue}>
                        <SelectTrigger className={`${classes.field}`}>
                            <SelectValue placeholder={select.placeholder} />
                        </SelectTrigger>

                        <SelectContent>
                            {select.options?.map((option) => (
                                <SelectItem className={`${classes.options}`} key={option.key} value={option.value}>{option.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                )
                    : (radio && fieldType === "radio") ?
                        (<RadioGroup
                            onValueChange={radio.onValueChange}
                            defaultValue={radio.defaultValue}
                        >
                            {radio.options.map(c => (
                                <FormItem key={c.key} className="flex items-center space-x-3 space-y-0">
                                    <FormControl>
                                        <RadioGroupItem className="h-8 w-8" value={c.value} />
                                    </FormControl>
                                    <FormLabel className="font-normal text-3xl">
                                        {c.name}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>)
                        : formControlChildren}
            </FormControl>
            <FormDescription className={`${classes.description}`}>
                {description}
            </FormDescription>
            <FormMessage />
        </FormItem>
    )
}

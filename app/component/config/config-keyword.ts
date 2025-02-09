import * as yup from "yup";

export const keywordFilterSchema = yup.object().shape({
    keyword: yup
        .string()
        .nullable(),
    category: yup.array().of(yup.string().uuid()).optional(),
});

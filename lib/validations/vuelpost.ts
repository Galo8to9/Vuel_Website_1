import * as z from "zod";

export const VuelPostValidation = z.object({
  vuelPost: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
  accountId: z.string(),
});

export const CommentValidation = z.object({
  vuelPost: z.string().nonempty().min(3, { message: "Minimum 3 characters." }),
});
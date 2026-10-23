import { ApiError } from "../utils/ApiError.js";

/**
 * Validates req[source] against a Zod schema and replaces it with the parsed value.
 * Field errors come back as { field: message } so forms can show them inline.
 */
export function validate(schema, source = "body") {
  return (req, _res, next) => {
    const result = schema.safeParse(req[source] ?? {});
    if (!result.success) {
      const fields = {};
      for (const issue of result.error.issues) {
        const key = issue.path.join(".") || "form";
        if (!fields[key]) fields[key] = issue.message;
      }
      throw ApiError.badRequest("Please fix the highlighted fields.", fields);
    }
    if (source === "query") {
      req.validatedQuery = result.data;
    } else {
      req[source] = result.data;
    }
    next();
  };
}

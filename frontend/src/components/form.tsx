import { useForm } from "@tanstack/react-form";
import { zodValidator } from "@tanstack/zod-form-adapter";
import { z } from "zod";
import { createUser } from "../utils/api";
import toast, { Toaster } from "react-hot-toast";
export default function Form() {
  const form = useForm({
    validatorAdapter: zodValidator(),
    validators: {
      onChange: z.object({
        username: z
          .string()
          .min(3, "Username must have three characters")
          .max(20, "Username must have less than 20 characters"),
        email: z.string().email("Invalid email"),
        password: z
          .string()
          .min(12, "Password needs to have at least 12 chars")
          .max(64, "Password needs to have less than 64 chars"),
      }),
    },
    defaultValues: {
      username: "John",
      email: "john@example.com",
      password: "",
    },
    onSubmit: async (values) => {
      console.log(values);
      try {
        await createUser(
          values.value.username,
          values.value.email,
          values.value.password,
        );
        console.info("User created");
        toast.success("User created");
      } catch (error) {
        console.error(`${error}`);
        toast.error(`${error}`);
      }
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit(e);
        }}
      >
        <div>
          <form.Field
            name="username"
            children={(field) => {
              return (
                <>
                  <input
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="email"
            children={(field) => {
              return (
                <>
                  <input
                    type="email"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <div>
          <form.Field
            name="password"
            children={(field) => {
              return (
                <>
                  <input
                    type="password"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              );
            }}
          />
        </div>
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
          children={([canSubmit, isSubmitting]) => (
            <button type="submit" disabled={!canSubmit}>
              {isSubmitting ? "..." : "Submit"}
            </button>
          )}
        />
      </form>
    </div>
  );
}

const FieldInfo = ({ field }) => {
  return (
    <>
      {field.state.meta.errors.length > 0 ? (
        <em role="alert">{field.state.meta.errors.join(", ")}</em>
      ) : null}
    </>
  );
};

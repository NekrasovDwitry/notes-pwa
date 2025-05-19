import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.scss";
import { useLogin } from "@/features/auth/model/use-login.ts";

const loginSchema = z.object({
  email: z
    .string({
      required_error: "Email обязателен",
    })
    .email("Неверный email"),
  password: z
    .string({
      required_error: "Пароль обязателен",
    })
    .min(6, "Пароль должен быть не менее 6 символов"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const { errorMessage, isPending, login } = useLogin();
  const onSubmit = form.handleSubmit(login);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          className={styles.input}
          placeholder="admin@gmail.com"
          {...form.register("email")}
        />
        {form.formState.errors.email && (
          <p className={styles.errorMessage}>
            {form.formState.errors.email.message}
          </p>
        )}
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="password">
          Пароль
        </label>
        <input
          id="password"
          type="password"
          className={styles.input}
          placeholder="******"
          {...form.register("password")}
        />
        {form.formState.errors.password && (
          <p className={styles.errorMessage}>
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isPending}
      >
        Войти
      </button>
    </form>
  );
}

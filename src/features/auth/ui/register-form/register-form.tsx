import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import styles from "./styles.module.scss";
import { useRegister } from "@/features/auth/model/use-register.ts";

const registerSchema = z
  .object({
    email: z
      .string({ required_error: "Email обязателен" })
      .email("Неверный email"),
    password: z
      .string({ required_error: "Пароль обязателен" })
      .min(6, "Пароль должен быть не менее 6 символов"),
    confirmPassword: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Пароли не совпадают",
  });

type RegisterFormData = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { errorMessage, isPending, register } = useRegister();

  const onSubmit = form.handleSubmit(register);

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

      <div className={styles.formGroup}>
        <label className={styles.label} htmlFor="confirmPassword">
          Подтвердите пароль
        </label>
        <input
          id="confirmPassword"
          type="password"
          className={styles.input}
          {...form.register("confirmPassword")}
        />
        {form.formState.errors.confirmPassword && (
          <p className={styles.errorMessage}>
            {form.formState.errors.confirmPassword.message}
          </p>
        )}
      </div>

      {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

      <button
        type="submit"
        className={styles.submitButton}
        disabled={isPending}
      >
        Зарегистрироваться
      </button>
    </form>
  );
}

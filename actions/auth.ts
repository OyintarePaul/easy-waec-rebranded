"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";

// Schemas
const loginSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

const signUpSchema = z.object({
  email: z.email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
});

export type AuthState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

/**
 * Helper to extract field errors without using deprecated .flatten()
 */
function extractFieldErrors(error: z.ZodError): Record<string, string[]> {
  const fieldErrors: Record<string, string[]> = {};
  for (const issue of error.issues) {
    const field = issue.path[0]?.toString();
    if (field) {
      if (!fieldErrors[field]) fieldErrors[field] = [];
      fieldErrors[field].push(issue.message);
    }
  }
  return fieldErrors;
}

/**
 * Log in an existing user using email and password.
 */
export async function loginUser(prevState: AuthState | void, formData: FormData): Promise<AuthState> {
  const rawData = Object.fromEntries(formData.entries());
  const validated = loginSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      fieldErrors: extractFieldErrors(validated.error),
    };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");
  redirect("/dashboard");
}

/**
 * Register a new user with email, password, and phone number.
 */
export async function signUpUser(prevState: AuthState | void, formData: FormData): Promise<AuthState> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const rawData = Object.fromEntries(formData.entries());
  const validated = signUpSchema.safeParse(rawData);

  if (!validated.success) {
    return {
      fieldErrors: extractFieldErrors(validated.error),
    };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
    options: {
      data: {
        phone: validated.data.phone,
      },
      emailRedirectTo: baseUrl + "/auth/callback"
    },
  });

  if (error) {
    return { error: error.message };
  }

  revalidatePath("/", "layout");

  // Redirect to login if email confirmation is enabled, otherwise straight to dashboard
  if (data?.session) {
    redirect("/dashboard");
  } else {
    redirect("/auth/sign-up-success");
  }
}

/**
 * Log out the active session.
 */
export async function logoutUser() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/auth/login");
}
"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/password-input";
import { createClient } from "@/lib/supabase/client";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const passwordSchema = z
  .object({
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .regex(/[a-zA-Z]/, "Password must contain at least one letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[^a-zA-Z0-9]/,
        "Password must contain at least one special character"
      ),
    passwordConfirmation: z
      .string()
      .nonempty("Password confirmation is required"),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords do not match",
    path: ["passwordConfirmation"],
  });

type PasswordFormData = z.infer<typeof passwordSchema>;

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
  });
  const router = useRouter();
  const supabase = createClient();

  const onSubmit = async (data: PasswordFormData) => {
    const accessToken = (await supabase.auth.getSession()).data.session
      ?.access_token;
    console.log(accessToken);
    const { data: authdata, error } = await supabase.auth.updateUser({
      email: "jacksongathondu@gmail.com",
      password: data.password,
    });
    if (authdata.user) {
      toast("Password successfully reset");
      setTimeout(() => {
        router.push("com.yengolf://");
      }, 2000); // 2000 milliseconds = 2 seconds
    }
    if (error)
      toast(
        `Failed to reset password. Please try again. Error: ${error.message}`
      );
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-col space-y-3">
        <Label htmlFor="password">New Password</Label>
        <PasswordInput
          id="password"
          {...register("password")}
          autoComplete="new-password"
        />

        {errors.password && (
          <div className="text-red-500 text-sm leading-loose font-light flex items-center">
            <TriangleAlert className="h-4 w-4 mr-3" />
            <p>{errors.password.message}</p>
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-3">
        <Label htmlFor="password_confirmation">Confirm Password</Label>
        <PasswordInput
          id="password_confirmation"
          {...register("passwordConfirmation")}
          autoComplete="new-password"
        />
        {errors.passwordConfirmation && (
          <div className="text-red-500 text-sm leading-loose font-light flex items-center">
            <TriangleAlert className="h-4 w-4 mr-3" />
            <p>{errors.passwordConfirmation.message}</p>
          </div>
        )}
      </div>
      <Button className="bg-rose-600 hover:bg-rose-700" type="submit">
        Save
      </Button>
    </form>
  );
};

export default ResetPassword;

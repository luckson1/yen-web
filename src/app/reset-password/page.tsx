"use client";
import ResetPassword from "@/components/reset-password";
import { createClient } from "@/lib/supabase/client";

export default function Reset() {
  const supabase=createClient()
  const c=supabase.auth.getUser()
  console.log()
  return (
    <div className="flex items-center justify-center w-full mx-auto">
      <div className="w-full max-w-lg my-20">
        <h2 className="text-center text-2xl mb-6">Reset Your Password</h2>
        <p className="text-center mb-4">Enter your new password below.</p>
        <p className="text-center mb-8">
          It should be at least 6 characters long, and contain one letter, one
          number, and one special character.
        </p>
        <ResetPassword />
      </div>
    </div>
  );
}

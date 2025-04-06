import { useState } from "react";
import { Dialog, DialogContent } from "../ui/dialog";
import { useToast } from "../../hooks/use-toast";
import { useAuth } from "../../hooks/use-auth";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2 } from "lucide-react";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const loginSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { toast } = useToast();
  const { loginMutation } = useAuth();
  
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  
  const handleLogin = (data: LoginFormValues) => {
    loginMutation.mutate(data, {
      onSuccess: () => {
        onClose();
        toast({
          title: "Welcome to EmoBuddy!",
          description: "You've successfully signed in.",
        });
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4 sm:mx-auto">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center mb-4">
            <i className="ri-emotion-happy-line text-primary-500 text-4xl"></i>
          </div>
          <h2 className="font-heading font-semibold text-2xl text-neutral-800 mb-2">Welcome to EmoBuddy</h2>
          <p className="text-neutral-600">Your AI-powered emotional support companion</p>
        </div>
        
        <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4 mb-6">
          <div className="space-y-2">
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username"
              {...loginForm.register("username")}
            />
            {loginForm.formState.errors.username && (
              <p className="text-sm text-red-500">
                {loginForm.formState.errors.username.message}
              </p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password"
              type="password"
              {...loginForm.register("password")}
            />
            {loginForm.formState.errors.password && (
              <p className="text-sm text-red-500">
                {loginForm.formState.errors.password.message}
              </p>
            )}
          </div>
          
          <Button 
            className="w-full" 
            type="submit" 
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging in...
              </>
            ) : (
              "Login"
            )}
          </Button>
          
          <div className="text-center">
            <p className="text-sm text-neutral-600">
              Don't have an account?{" "}
              <a 
                href="/auth" 
                onClick={(e) => {
                  e.preventDefault();
                  onClose();
                  window.location.href = "/auth";
                }}
                className="text-primary hover:underline font-medium"
              >
                Register here
              </a>
            </p>
          </div>
        </form>
        
        <div className="text-center text-xs text-neutral-500">
          <p>
            By continuing, you agree to our <a href="#" className="text-primary-600 hover:underline">Terms of Service</a> and <a href="#" className="text-primary-600 hover:underline">Privacy Policy</a>.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

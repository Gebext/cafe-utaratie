import { LoginForm } from "@/components/auth/LoginForm";
import { CaffeLogo } from "@/components/caffe-logo";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#f0f5f9]">
      <div className="w-full max-w-md">
        <div className="mb-2 flex flex-col items-center space-y-2 text-center">
          <CaffeLogo />
          <div>
            <h1
              className="text-3xl font-bold tracking-tight text-[#1e6091]"
              style={{ fontFamily: "Pirata One, cursive" }}
            >
              Caffe Utaratie
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Employee Portal
            </p>
          </div>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}

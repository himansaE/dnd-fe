import { SignIn } from "@clerk/clerk-react";

const SignInPage = () => (
  <div className="flex flex-col gap-5 items-center justify-center min-h-screen bg-charcoal bg-center bg-contain relative">
    <SignIn />
  </div>
);

export default SignInPage;

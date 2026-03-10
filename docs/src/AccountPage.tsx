import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignIn,
  UserProfile,
} from "@clerk/clerk-react";
import { dark } from '@clerk/ui/themes'

const viteEnv = (import.meta as ImportMeta & {
  env?: Record<string, string | undefined>;
}).env;

const clerkPubKey =
  viteEnv?.ZUDOKU_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  (typeof process !== "undefined"
    ? process.env.ZUDOKU_PUBLIC_CLERK_PUBLISHABLE_KEY
    : undefined);

export default function AccountPage() {
  if (!clerkPubKey) {
    return (
      <section className="mx-auto w-full max-w-5xl px-4 py-8 md:px-6">
        <h1 className="mb-6 text-2xl font-semibold">Account</h1>
        <p>Clerk is not configured for this environment.</p>
      </section>
    );
  }

  return (
    <div className="my-4">
      <ClerkProvider publishableKey={clerkPubKey} appearance={{theme: dark}}>
          <SignedIn>
            <UserProfile path="/account" routing="path" />
          </SignedIn>

          <SignedOut>
            <SignIn routing="virtual" signUpUrl="/account?mode=sign-up" />
          </SignedOut>
      </ClerkProvider>
    </div>
  );
}

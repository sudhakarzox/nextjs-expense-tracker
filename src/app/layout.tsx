import type { Metadata } from "next";
import "./globals.css";
import { redirect } from "next/navigation";
import SignOutButton from "@/components/SignoutButton";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { TypingText } from "@/components/TypingText/TypingText";


export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Expense Tracker",
  description: "Track your expenses effortlessly",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);
  const user = process.env.USER as string;

  if (!session) {
    redirect("/api/auth/signin"); // Redirect to sign-in if no session
  } 


  return (
    <html lang="en" className="dark" >
    <head >     {/*  head monce? */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#10b981" />
        <link rel="icon" href="/icons/courthouse.png" />
        <link rel="apple-touch-icon" href="/icons/courthouse.png" />
      </head>
      <body className="bg-black text-gray-200 min-h-screen flex flex-col">
        {/* Render only after session validation */}
        {session && (
          <>
            {/* Header */}
            <header className="w-full border bg-gray-900 text-white-400 px-6 py-4 shadow">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <h1 className="text-2xl font-bold">Expense Tracker</h1>
                <div className="flex items-center space-x-4">
                <nav className="space-x-4 hidden sm:block">
                  <a href="/transactions-list" className="hover:underline">
                    Transactions
                  </a>
                  <a href="/categories" className="hover:underline">
                    Categories
                  </a>
                </nav>
                {session?.user?.image && (
                  // <Image> from next/image gives CSP issues
                  // eslint-disable-next-line @next/next/no-img-element 
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? "User avatar"}
                    width={40}
                    height={40}
                    className="rounded-full border border-gray-700"
                    loading="lazy"
                  />
                )}
                </div>
              </div>
            </header>

            {/* Main Content */}
            {/* <main className="flex-grow p-4">{children}</main> */}
            {session?.user?.name === user && (
                <main className="flex-grow p-4">{children}</main>
              )}
              {session?.user?.name !== user && (
                <div className="flex flex-col items-center justify-center space-y-6 bg-black text-gray-150 min-h-screen">
                  <main className="flex-grow items-center p-4">
                    <TypingText text={`Hii, Sry..! you are not Authorized...... `} />
                  </main>
                </div>
              )}

            {/* Footer */}
            <footer className="w-full border-t bg-gray-800   px-6 py-2">
              <div className="max-w-6xl mx-auto flex justify-between items-center">
                <p>&copy; {new Date().getFullYear()} Expense Tracker</p>
                <SignOutButton />
              </div>
            </footer>
          </>
        )}
      </body>
    </html>
  );
}

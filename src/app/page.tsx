// import Image from "next/image";

import { TypingText } from "@/components/TypingText/TypingText";
import { authOptions } from "@/lib/authOptions";
import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  
  return (
    <div className="flex flex-col items-center justify-center space-y-6 bg-black text-gray-150 min-h-screen">
      <TypingText text={`Hii, ${session ? session.user.name : "User"}...! `} />
      <h2 className="text-3xl font-bold text-center text-gray-250 m-5">
        Track your expenses effortlessly
      </h2>
      <p className="text-gray-100 text-lg text-center max-w-xl">
        Easily manage your expenses and understand your spending habits.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 w-full max-w-4xl">
        <HomeCard
          title="Transaction Form"
          href="/transactionForm"
          desc="Add your transactions"
        />
        <HomeCard
          title="Transactions"
          href="/transactions-list"
          desc="View/Edit your transactions"
        />
        <HomeCard
          title="Categories"
          href="/categories"
          desc="Manage your spending categories"
        />
        <HomeCard
          title="Add Account"
          href="/accounts"
          desc="Create and manage accounts"
        />
        {/* <HomeCard title="Creditors" href="/creditors" desc="Manage people you owe money to" /> */}
        <HomeCard
          title="Debtors Transactions"
          href="/dtransactions"
          desc="Track who owes you money"
        />
        <HomeCard title="Debtors" href="/debtors" desc="Add Debtors" />
        <HomeCard
          title="Reports"
          href="/report"
          desc="Get summaries and analytics"
        />
      </div>
    </div>
  );
}

function HomeCard({
  title,
  href,
  desc,
}: {
  title: string;
  href: string;
  desc: string;
}) {
  return (
    <div className="w-full rounded-lg border bg-gray-900  shadow-gray-50 border-gray-500 p-6 hover:shadow-sm transition hover:bg-gray-100  hover:text-black">
    <a
      href={href}
      
    >
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{desc}</p>
    </a>
    </div>
  );}
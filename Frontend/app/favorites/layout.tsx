// generate layout code

import { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react"; 


export default function FavoritesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <Link href="/" className="flex items-center gap-2 mb-6 text-sm text-slate-400 hover:text-slate-200 transition-colors">
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        {children}
      </div>
    </div>
  );
}
import Link from "next/link";
import CreateAcademyForm from "@/components/admin/CreateAcademyForm";

export default function AdminAcademyNewPage() {
  return (
    <div>
      <Link href="/admin/academies" className="mb-4 inline-block text-sm text-beauty-gray hover:text-primary">
        ← 학원 목록
      </Link>
      <h1 className="mb-6 text-2xl font-bold text-beauty-neutral">B2B 학원 등록</h1>
      <CreateAcademyForm />
    </div>
  );
}

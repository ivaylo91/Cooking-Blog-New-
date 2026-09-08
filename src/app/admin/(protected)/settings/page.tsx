import { Settings } from "lucide-react";
import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";

export default function SettingsPage() {
  return (
    <div>
      <h1 className="mb-6 flex items-center gap-2 font-heading text-2xl font-semibold">
        <Settings size={20} className="text-accent" />
        Настройки
      </h1>
      <ChangePasswordForm />
    </div>
  );
}

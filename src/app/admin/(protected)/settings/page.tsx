import { ChangePasswordForm } from "@/components/admin/ChangePasswordForm";
import { pageTitle } from "@/components/admin/styles";

export default function SettingsPage() {
  return (
    <div>
      <h1 className={`mb-6 ${pageTitle}`}>Настройки</h1>
      <ChangePasswordForm />
    </div>
  );
}

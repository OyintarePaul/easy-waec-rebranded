import { getAuthUser } from "@/data/auth";

export async function UserEmailPlaceholder() {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const userInfo = await getAuthUser();
  return (
    <span className="font-semibold text-gray-900 dark:text-white">
      {userInfo?.email || "Valued Customer"}
    </span>
  );
}
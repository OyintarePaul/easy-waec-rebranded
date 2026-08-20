import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getAuthUser = cache(async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const userInfo = {
        id: user.id,
        email: user.email || "",
        phone: user.user_metadata?.phone as string | undefined,
    }
    return userInfo;
})
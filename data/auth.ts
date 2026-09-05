import "server-only";

import { createClient } from "@/lib/supabase/server";
import { cache } from "react";

export const getAuthUser = cache(async () => {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    const userInfo = {
        id: user.id,
        email: user.email || "",
        phone: user.user_metadata?.phone as string | undefined,
    };
    
    return userInfo;
});
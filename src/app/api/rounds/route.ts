import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic"; // defaults to auto

export async function GET(request: Request) {
  const supabase = createClient();

  const jwt = request.headers.get("Authorization")?.replace("Bearer ", ""); // need to use jwt
  const site = request.headers.get("Site");

  if (!jwt) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser(jwt);

  if (!user || user === null) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  // Get rounds from last month
  const now = new Date();
  const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfPreviousMonth = new Date(startOfCurrentMonth);
  startOfPreviousMonth.setMonth(startOfPreviousMonth.getMonth() - 1);
  const endOfPreviousMonth = new Date(startOfCurrentMonth);

  const startOfPreviousMonthISO = startOfPreviousMonth.toISOString();
  const endOfPreviousMonthISO = endOfPreviousMonth.toISOString();

  //TODO- switch between these two queries
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .gte('created_at', startOfPreviousMonthISO)
    .lt('created_at', endOfPreviousMonthISO)
    .order("created_at", { ascending: false });

  /*
    const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .order("created_at", { ascending: false })
    */

  if (error) {
    console.error(error);
    return new Response("Failed to get rounds", {
      status: 500,
    });
  } else {
    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
      },
    });
  }
}

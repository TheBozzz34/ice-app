import { createClient } from "@/utils/supabase/server";
import type { NextApiRequest, NextApiResponse } from 'next'
import { headers } from 'next/headers'

export const dynamic = "force-dynamic"; // defaults to auto


export async function GET(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const headersList = headers()
  const searchParams = req.url ? new URLSearchParams(req.url.split("?")[1]) : new URLSearchParams();
  const supabase = createClient();

  const from = searchParams.get("from");
  const to = searchParams.get("to");


  const authorizationHeader = headersList.get('authorization');
  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid authorization header" }),
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const jwt = authorizationHeader.split(" ")[1]; // Extract the token

  
  const {
    data: { user },
  } = await supabase.auth.getUser(jwt);

  // Check if user is authenticated
  if (!user || user === null) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Check for missing date range
  if (!from || !to) {
    return new Response(
      JSON.stringify({ error: "Missing date range" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const fromDate = new Date(from as string);
  const toDate = new Date(to as string);

  // Fetch rounds from the database within the date range
  const { data, error } = await supabase
    .from("rounds")
    .select("*")
    .gte("created_at", fromDate.toISOString())
    .lte("created_at", toDate.toISOString());

  if (error) {
    console.error("Error fetching rounds:", error);
    return new Response(JSON.stringify({ error: "Error fetching rounds" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Send the retrieved data as a JSON response
  return new Response(JSON.stringify(data), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}

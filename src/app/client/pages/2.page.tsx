"use client"

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { createClient } from "@/utils/supabase/client";
import { useState } from "react"

export default function Page2() {
  const supabase = createClient()

  const [rounds, setRounds] = useState([])

  async function fetchRounds() {
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.user) {
      // redirect('/login')
    } else {

    }
    const { data, error } = await supabase.from("rounds")
      .select("*")
      .order("created_at", { ascending: false })
      .eq("created_by", user?.user?.id)

    if (error) {
      console.error(error)
    } else {
      setRounds(data)
      console.log(data)
    }
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Recent Rounds</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <Button onClick={fetchRounds}>Fetch Rounds</Button>
          <Table>
      <TableCaption>A list of your recent rounds.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Date</TableHead>
          <TableHead>cerated by</TableHead>
          <TableHead>stacker</TableHead>
          <TableHead className="text-right">coin box</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rounds.map((round) => (
          <TableRow key={round.id}>
            <TableCell className="font-medium">{round.created_at}</TableCell>
            <TableCell>{round.created_by}</TableCell>
            <TableCell>{round.ice_sales_info_stacker}</TableCell>
            <TableCell className="text-right">{round.ice_sales_info_coin_box}</TableCell>
          </TableRow>
        ))}
      </TableBody>
      <TableFooter>
        <TableRow>
          <TableCell colSpan={3}>Total</TableCell>
          <TableCell className="text-right">math here</TableCell>
        </TableRow>
      </TableFooter>
    </Table>

        </div>
      </div>
    </>
  )
}
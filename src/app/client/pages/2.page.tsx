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
import { useState , useEffect} from "react"
import { Pencil } from "lucide-react";
import { CircularProgress } from "@mui/material"; 



const sites = new Map([
  [0, "Site 1"],
  [1, "Site 2"],
  [2, "Site 3"],
  [3, "Site 4"],
  [4, "Site 5"],
  [5, "Site 6"],
  [6, "Site 7"],
  [7, "Site 8"],
  [8, "Site 9"],
  [9, "Site 10"],
])

function prettyDate(date: string) {
  return new Date(date).toLocaleDateString('en-US')
}

type Round = {
  id: number
  created_at: string
  round_site: number
  ice_sales_info_stacker: string
  ice_sales_info_coin_box: number
}

export default function Page2() {
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(true)

  const [rounds, setRounds] = useState<Round[]>([]);
  const [dDate, setdDate] = useState(new Date());

  async function setDepositDate(date: string) {
    console.log(date)
  }

  async function fetchRounds() {
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.user) {
      // redirect('/login')
    } else {

      console.log(user.user.id)

      const { data, error } = await supabase.from("rounds")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("created_by", user?.user?.id)

      if (error) {
        console.error(error)
      } else {
        setRounds(data)
        console.log(data)
        setIsLoading(false)
      }

    }
  }

  useEffect(() => {
    fetchRounds()
  }, [])

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Your Recent Rounds</h1>
      </div>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <Table>
            <TableCaption>A list of your recent rounds.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">date</TableHead>
                <TableHead>site</TableHead>
                <TableHead>stacker</TableHead>
                <TableHead>coin box</TableHead>
                <TableHead>edit round</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rounds.map((round) => (
                <TableRow key={round.id}>
                  <TableCell className="font-medium">{prettyDate(round.created_at)}</TableCell>
                  <TableCell>{sites.get(round.round_site)}</TableCell>
                  <TableCell>{round.ice_sales_info_stacker}</TableCell>
                  <TableCell>{round.ice_sales_info_coin_box}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => setDepositDate(round.created_at)}
                      className="text-primary"
                    >
                      <Pencil className="text-secondary" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="hidden">
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">math here</TableCell>
              </TableRow>
            </TableFooter>
          </Table>

        </div>

        {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-90">
        <CircularProgress color="primary" /> {/* Use CircularProgress component */}
      </div>
      )}

      </div>
    </>
  )
}
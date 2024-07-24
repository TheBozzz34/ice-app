"use client";
// TODO - Employee edit maybe?
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createClient } from "@/utils/supabase/client";
import { useState, useEffect } from "react";
import { Pointer, RefreshCcw } from "lucide-react";
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
]);

function prettyDate(date: string) {
  return new Date(date).toLocaleDateString("en-US");
}

type Round = {
  id: number;
  created_at: string;
  round_site: number;
  ice_sales_info_stacker: string;
  ice_sales_info_coin_box: number;
  wf_deposit_date: number;
  deposited: boolean;
};

interface RoundSelectorProps {
  round: Round;
}

export default function Page2() {
  const supabase = createClient();

  const [isLoading, setIsLoading] = useState(true);

  const [rounds, setRounds] = useState<Round[]>([]);
  const [dDate, setdDate] = useState(new Date());

  const [selectedRounds, setSelectedRounds] = useState<number[]>([]);

  const handleCheckboxChange = (roundId: number) => {
    setSelectedRounds((prevSelectedRounds) => {
      if (prevSelectedRounds.includes(roundId)) {
        return prevSelectedRounds.filter((id) => id !== roundId);
      } else {
        return [...prevSelectedRounds, roundId];
      }
    });
  };


  const lastWeekDate = new Date();

  lastWeekDate.setDate(lastWeekDate.getDate() - 7);


  async function setDepositDate(id: number) {
    //console.log(date);
    const user = await getUser();
    const date = Date.now()

    if (user) {
      console.log(id)

      /*
      const { error, data } = await supabase
          .from('rounds')
          .update({ wf_deposit_date: date })
          .eq('id', id)
          .select()

       */





      const { data, error } = await supabase
        .from('rounds')
        .update({ wf_deposit_date: new Date() })
        .eq('id', id)
        .select()




      if (error) {
        console.log(error.message);
      } else {
        console.log(data);
        await fetchRounds();
      }
    }
  }

  async function getUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  }


  async function fetchRounds() {
    const { data: user, error: userError } = await supabase.auth.getUser();
    if (userError || !user?.user) {
      // redirect('/login')
    } else {
      console.log(user.user.id);

      // Fetch last 7 days of rounds
      const { data, error } = await supabase
        .from("rounds")
        .select("*")
        .order("created_at", { ascending: false })
        .eq("created_by", user?.user?.id)
        .gte("created_at", lastWeekDate.toISOString());

      if (error) {
        console.error(error);
      } else {
        setRounds(data);
        console.log(data);
        setIsLoading(false);
      }
    }
  }

  useEffect(() => {
    fetchRounds();
  }, []);

  return (
    <>
      <div className="flex flex-col items-center sm:flex-row sm:justify-between">
        <h1 className="text-lg font-semibold sm:text-2xl">
          Rounds for the last week ({prettyDate(lastWeekDate.toISOString())} - {prettyDate(new Date().toISOString())})

          <Button
            className="ml-2"
            onClick={() => {
              fetchRounds();
            }}
          >
            <RefreshCcw size={24} />
          </Button>

        </h1>
      </div>
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed shadow-sm p-2 sm:p-4">
        <div className="flex flex-col items-center gap-1 text-center">
          {selectedRounds.length > 0 && (
            <div className="flex flex-col items-center gap-2 sm:flex-row">
              <Button
                onClick={() => {
                  selectedRounds.forEach((id) => {
                    // setDepositDate(id); // This is the function that will update the deposit date
                    // TODO - Add values to deposit table
                  });
                  setSelectedRounds([]);
                }}
              >
                {selectedRounds.length > 1 ? (
                  <>Batch deposit {selectedRounds.length} rounds.</>
                ) : (
                  <>Deposit single round.</>
                )}
                <Pointer size={24} className="ml-2" />
              </Button>
            </div>
          )}
  
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[60px] sm:w-[100px]">Date</TableHead>
                <TableHead>Site</TableHead>
                <TableHead>Stacker</TableHead>
                <TableHead>Coin Box</TableHead>
                <TableHead>Deposited</TableHead>
                <TableHead>Select</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rounds.map((round) => (
                <TableRow key={round.id}>
                  <TableCell className="font-medium">{prettyDate(round.created_at)}</TableCell>
                  <TableCell>{sites.get(round.round_site)}</TableCell>
                  <TableCell>{round.ice_sales_info_stacker}</TableCell>
                  <TableCell>{round.ice_sales_info_coin_box}</TableCell>
                  <TableCell>{round.deposited ? <>Deposited</> : <>Needs Deposit</>}</TableCell>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedRounds.includes(round.id)}
                      onChange={() => handleCheckboxChange(round.id)}
                      disabled={round.deposited}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
  
        {isLoading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-90">
            <CircularProgress color="primary" />
          </div>
        )}
      </div>
    </>
  );
}
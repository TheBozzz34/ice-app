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
import { useRouter } from 'next/navigation'

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

function arrayToJSON(array: any) {
  return JSON.parse(JSON.stringify(array));
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
  const router = useRouter()
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


  async function depositRounds() {
    try {
      const { data: user, error: userError } = await supabase.auth.getUser();
      if (userError || !user?.user) {
        router.push('/error?__message=' + btoa('User not authenticated'));
        console.error("User not authenticated:", userError);
        return;
      } else {
        console.log(user.user.id);
    
        let bills = 0;
        let coins = 0;
        let rounds: number[] = [];
    
        const coinPromises = selectedRounds.map(async (roundId) => {
          try {
            const { data, error } = await supabase
              .from("rounds")
              .select("ice_sales_info_coin_box")
              .eq("id", roundId);
    
            if (error) {
              console.error(`Error fetching coin data for round ${roundId}:`, error);
            } else {
              if (data && data.length > 0) {
                coins += data[0].ice_sales_info_coin_box;
              } else {
                console.error(`No coin data found for round ${roundId}`);
              }
            }
          } catch (err) {
            console.error(`Error processing coin data for round ${roundId}:`, err);
          }
        });
    
        const billPromises = selectedRounds.map(async (roundId) => {
          try {
            const { data, error } = await supabase
              .from("rounds")
              .select("ice_sales_info_stacker")
              .eq("id", roundId);
    
            if (error) {
              console.error(`Error fetching bill data for round ${roundId}:`, error);
            } else {
              if (data && data.length > 0) {
                bills += parseInt(data[0].ice_sales_info_stacker);
              } else {
                console.error(`No bill data found for round ${roundId}`);
              }
            }
          } catch (err) {
            console.error(`Error processing bill data for round ${roundId}:`, err);
          }
        });
    
        await Promise.all([...coinPromises, ...billPromises]);
    
        selectedRounds.forEach((roundId) => {
          rounds.push(roundId);
        });
  
        rounds = arrayToJSON(rounds);
    
        console.log("total bills: " + bills);
        console.log("total coins: " + coins);
    
        console.log("rounds: " + rounds);
    
        try {
          const { data, error } = await supabase
            .from('deposit')
            .insert([
              { user: user?.user?.id, bills: bills, coins: coins, rounds: rounds }
            ])
            .select();
  
          if (error) {
            console.error("Error inserting deposit data:", error);
          }
        } catch (err) {
          console.error("Error during deposit insertion:", err);
        }
      }
  
      for (const roundId of selectedRounds) {
        try {
          const { data, error } = await supabase
            .from("rounds")
            .update({ deposited: true, wf_deposit_date: new Date() })
            .eq("id", roundId);
  
          if (error) {
            console.error(`Error updating round ${roundId}:`, error);
          }
        } catch (err) {
          console.error(`Error processing round update for ${roundId}:`, err);
        }
      }
    
      fetchRounds();
    } catch (err) {
      console.error("Unexpected error in depositRounds function:", err);
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
                  depositRounds();
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
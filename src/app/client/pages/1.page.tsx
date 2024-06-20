"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { create } from "domain";

export default function Page1() {
  const [buttonMessage, setButtonMessage] = useState("Start Flow");
  const supabase = createClient();

  async function getUserId() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error(error);
    } else {
      return data.user.id;
    }
  }

  let [ice_sales_info_stacker, setIceSalesStacker] = useState(0); // bad, causes lots of NaN errors
  let [ice_sales_info_coin_box, setIceSalesCoinBox] = useState(0);
  let [water_coin_calc_current, setWaterCoinCalcCurrent] = useState(0);
  let [water_bills_sales, setWaterBillsSales] = useState(0);
  let [site, setSite] = useState(0);

  // tmp
  let [a, setA] = useState(0);
  let [b, setB] = useState(0);
  let [c, setC] = useState(0);
  let [d, setD] = useState(0);

  async function startFlow() {
    console.log("starting flow");
    setButtonMessage("Flow Started");

    // bills calculation

    const prev_water_coin = await latestWaterCoin(); // rolling value thing

    if (prev_water_coin) {
      let tmp = water_coin_calc_current - prev_water_coin;

      console.log("total wv coin:" + tmp);

      let wf_bills_total = a + tmp; // wells fargo bills deposit total
      console.log("wf bills total:" + a + "+" + tmp);

      // ---------------------

      let tmp2 = water_bills_sales - tmp;

      let wf_coins_total = b + tmp2;

      console.log(wf_coins_total);

      const created_by = await getUserId();

      /* shits goofed here
    let water_coin_calc_total = water_coin_calc_current - prev_water_coin

    let water_bills_calc_total = water_bills_sales - water_coin_calc_total

    const created_by = await getUserId()

    let wf_bills_total = ice_sales_info_stacker + water_bills_calc_total

    let wf_coins_total = ice_sales_info_coin_box + water_coin_calc_total
*/
      const { data, error } = await supabase.from("rounds").insert([
        {
          ice_sales_info_stacker: a,
          ice_sales_info_coin_box: b,
          water_coin_calc_current,
          water_bills_calc_sales: water_bills_sales,
          water_coin_calc_total: wf_coins_total,
          water_bills_calc_total: wf_bills_total,
          created_by,
          wf_deposit_coins_total: wf_coins_total,
          wf_deposit_bills_total: wf_bills_total,
          round_site: site,
        },
      ]);

      if (error) {
        console.error(error);
      } else {
        console.log(data);
        setButtonMessage("Flow Completed");
      }
    } else {
      console.log("No rolling value! This is bad.");
    }
  }

  async function latestWaterCoin() {
    const { data, error } = await supabase
      .from("rounds")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      console.error(error);
    } else {
      return data[0].water_coin_calc_current;
    }

    //return 1863
  }

  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">New round entry</h3>

          <div className="grid gap-4 p-4">
            <select name="site" id="site">
              <option value="0">Choose a Site</option>
              <option onClick={() => setSite(4)} value="4">Pojoaque</option>
            </select>

            <span className="text-lg font-semibold">Ice Sales Info</span>
            <Label htmlFor="ice_sales_stacker">Stacker:</Label>
            <Input
              id="ice_sales_stacker"
              type="number"
              onChange={(e) => setA(parseFloat(e.target.value))}
              value={a}
            />

            <Label htmlFor="ice_sales_coin">Coin Box:</Label>
            <Input
              id="ice_sales_coin"
              type="number"
              onChange={(e) => setB(parseFloat(e.target.value))}
              value={b}
            />

            <span className="text-lg font-semibold">
              Water Coin Calculation
            </span>
            <Label htmlFor="water_coin_current">Current Box: </Label>
            <Input
              id="water_coin_current"
              type="number"
              onChange={(e) =>
                setWaterCoinCalcCurrent(parseFloat(e.target.value))
              }
              value={water_coin_calc_current}
            />

            <span className="text-lg font-semibold">
              Water Bills Calculation
            </span>
            <Label htmlFor="water_bills_sales">
              Water Sales (from SmartIce):{" "}
            </Label>
            <Input
              id="water_bills_sales"
              type="number"
              onChange={(e) => setWaterBillsSales(parseFloat(e.target.value))}
              value={water_bills_sales}
            />

            

            <Button onClick={startFlow}>{buttonMessage}</Button>
          </div>
        </div>
      </div>
    </>
  );
}

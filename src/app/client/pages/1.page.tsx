"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Page1() {
  const [buttonMessage, setButtonMessage] = useState("Start Flow");
  const [mathDetails, setMathDetails] = useState<string[]>([]);
  const [prevWaterCoin, setPrevWaterCoin] = useState<number | null>(null);
  const supabase = createClient();

  const [ice_sales_info_stacker, setIceSalesStacker] = useState<number>(0);
  const [ice_sales_info_coin_box, setIceSalesCoinBox] = useState<number>(0);
  const [water_coin_calc_current, setWaterCoinCalcCurrent] = useState<number>(0);
  const [water_bills_sales, setWaterBillsSales] = useState<number>(0);
  const [recycled_coins, setRecycledCoins] = useState<number>(0);
  const [site, setSite] = useState<number>(0);

  const [a, setA] = useState<number>(0);
  const [b, setB] = useState<number>(0);

  async function getUserId() {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data?.user) {
      console.error(error);
    } else {
      return data.user.id;
    }
  }

  async function fetchLatestWaterCoin() {
    const { data, error } = await supabase
      .from("rounds")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);
    if (error) {
      console.error(error);
    } else {
      setPrevWaterCoin(data[0]?.water_coin_calc_current || 0);
    }
  }

  useEffect(() => {
    fetchLatestWaterCoin();
  }, []);

  useEffect(() => {
    if (prevWaterCoin !== null) {
      const tmp = water_coin_calc_current - prevWaterCoin;
      const wf_bills_total = a + tmp;
      const tmp2 = water_bills_sales - tmp;
      const wf_coins_total = b + tmp2;

      setMathDetails([
        `Total WV Coin: ${tmp}`,
        `WF Bills Total: ${a} + ${tmp} = ${wf_bills_total}`,
        `WF Coins Total: ${b} + ${tmp2} = ${wf_coins_total}`,
      ]);
    }
  }, [a, b, water_coin_calc_current, water_bills_sales, prevWaterCoin]);

  async function startFlow() {
    console.log("starting flow");
    setButtonMessage("Flow Started");

    if (prevWaterCoin !== null) {
      const tmp = water_coin_calc_current - prevWaterCoin;
      const wf_bills_total = a + tmp;
      const tmp2 = water_bills_sales - tmp;
      const wf_coins_total = b + tmp2;

      const created_by = await getUserId();

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
          recycled_coins,
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

  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">New round entry</h3>

          <div className="grid gap-4 p-4">
            <select name="site" id="site" onChange={(e) => setSite(parseInt(e.target.value))}>
              <option value="0">Choose a Site</option>
              <option value="4">Pojoaque</option>
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

            <span className="text-lg font-semibold">Water Sales Info</span>
            <Label htmlFor="water_coin_current">Current Box: </Label>
            <Input
              id="water_coin_current"
              type="number"
              onChange={(e) =>
                setWaterCoinCalcCurrent(parseFloat(e.target.value))
              }
              value={water_coin_calc_current}
            />
            <Label htmlFor="water_bills_sales">Water Sales (from SmartIce): </Label>
            <Input
              id="water_bills_sales"
              type="number"
              onChange={(e) => setWaterBillsSales(parseFloat(e.target.value))}
              value={water_bills_sales}
            />

            <Label htmlFor="recycle">Recycled Coins: </Label>
            <Input
              id="recycle"
              type="number"
              onChange={(e) => setRecycledCoins(parseFloat(e.target.value))}
              value={recycled_coins}
            />

            <Button onClick={startFlow}>{buttonMessage}</Button>
          </div>

          <Sheet>
            <SheetTrigger>
              <Button>View Calculations</Button>
            </SheetTrigger>
            <SheetContent>
              <div className="p-4">
                <h4 className="text-xl font-semibold">Calculation Details</h4>
                <ul>
                  {mathDetails.map((detail, index) => (
                    <li key={index}>{detail}</li>
                  ))}
                </ul>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </>
  );
}

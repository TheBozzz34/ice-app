import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { create } from "domain";


export default function Page1() {

  const [buttonMessage, setButtonMessage] = useState("Start Flow")
  const supabase = createClient()

  async function getUserId() {
    const { data, error } = await supabase.auth.getUser()
    if (error || !data?.user) {
      console.error(error)
    } else {
      return data.user.id
    }
  }

  let [ice_sales_info_stacker, setIceSalesStacker] = useState(0)
  let [ice_sales_info_coin_box, setIceSalesCoinBox] = useState(0)
  let [water_coin_calc_current, setWaterCoinCalcCurrent] = useState(0)
  let [water_bills_sales, setWaterBillsSales] = useState(0)
  let [site, setSite] = useState(0)

  async function startFlow() {
    console.log("starting flow")
    setButtonMessage("Flow Started")

    const prev_water_coin = await latestWaterCoin()

    let water_coin_calc_total = water_coin_calc_current - prev_water_coin

    let water_bills_calc_total = water_bills_sales - water_coin_calc_total

    const created_by = await getUserId()

    let wf_bills_total = ice_sales_info_stacker + water_bills_calc_total

    let wf_coins_total = ice_sales_info_coin_box + water_coin_calc_total

    const { data, error } = await supabase.from("rounds").insert([
      {
        ice_sales_info_stacker,
        ice_sales_info_coin_box,
        water_coin_calc_current,
        water_bills_calc_sales: water_bills_sales,
        water_coin_calc_total,
        water_bills_calc_total,
        created_by,
        wf_deposit_coins_total: wf_coins_total,
        wf_deposit_bills_total: wf_bills_total,
        round_site: site,
        wf_deposit_date: new Date()
      }
    ])

    if (error) {
      console.error(error)
    } else {
      console.log(data)
      setButtonMessage("Flow Completed")
    }

  }

  async function latestWaterCoin() {

    const { data, error } = await supabase.from("rounds").select("*").order("created_at", { ascending: false }).limit(1)
    if (error) {
      console.error(error)
    } else {
      return data[0].water_coin_current
    }


    //return 1863
  }




  return (
    <>
      <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
        <div className="flex flex-col items-center gap-1 text-center">
          <h3 className="text-2xl font-bold tracking-tight">
            New round entry
          </h3>

          <div className="grid gap-4 p-4">

              
            <span className="text-lg font-semibold">Ice Sales Info</span>
            <Label htmlFor="ice_sales_stacker">Stacker:</Label>
            <Input id="ice_sales_stacker" type="number" onChange={(e) => setIceSalesStacker(parseInt(e.target.value))} value={ice_sales_info_stacker} />

            <Label htmlFor="ice_sales_coin">Coin Box:</Label>
            <Input id="ice_sales_coin" type="number" onChange={(e) => setIceSalesCoinBox(parseInt(e.target.value))} value={ice_sales_info_coin_box} />

            <span className="text-lg font-semibold">Water Coin Calculation</span>
            <Label htmlFor="water_coin_current">$Box current: </Label>
            <Input id="water_coin_current" type="number" onChange={(e) => setWaterCoinCalcCurrent(parseInt(e.target.value))} value={water_coin_calc_current} />

            <span className="text-lg font-semibold">Water Bills Calculation</span>
            <Label htmlFor="water_bills_sales">Water Sales (from SmartIce): </Label>
            <Input id="water_bills_sales" type="number" onChange={(e) => setWaterBillsSales(parseInt(e.target.value))} value={water_bills_sales} />

            <span className="text-lg font-semibold">Site</span>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <span>Choose Site</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSite(1)}>Site 1</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSite(2)}>Site 2</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSite(3)}>Site 3</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSite(4)}>Site 4</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSite(5)}>Site 5</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>


            <Button onClick={startFlow}>{buttonMessage}</Button>
          </div>
        </div>
      </div>
    </>
  )
}
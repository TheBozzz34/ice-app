import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";


export default function Page1() {
    const supabase = createClient()
    let [ice_sales_coin, setIceSalesCoin] = useState(0)
    let [ice_sales_stacker, setIceSalesStacker] = useState(0)
    let [water_coin_current, setWaterCoinCurrent] = useState(0)
    let [water_bills_sales, setWaterBillsSales] = useState(0)

    async function startFlow() {
        console.log("starting flow")
    }

    const handleIceSalesStackerChange = (e) => {
      const value = parseInt(e.target.value)
      if (!isNaN(value)) {
          setIceSalesStacker(value)
      }
  }

  const handleIceSalesCoinChange = (e) => {
      const value = parseInt(e.target.value)
      if (!isNaN(value)) {
          setIceSalesCoin(value)
      }
  }

  const handleWaterCoinCurrentChange = (e) => {
      const value = parseInt(e.target.value)
      if (!isNaN(value)) {
          setWaterCoinCurrent(value)
      }
  }

  const handleWaterBillsSalesChange = (e) => {
      const value = parseInt(e.target.value)
      if (!isNaN(value)) {
          setWaterBillsSales(value)
      }
  }


    return (
        <>
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">link 1</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                Round entry for (get sitename from supabase user data)
              </h3>

                <Sheet>
                <SheetTrigger>
                  <Button className="mt-4">Add entry</Button>
                </SheetTrigger>
                <SheetContent>
                  <div className="grid gap-4 p-4">

                    <span className="text-lg font-semibold">Ice Sales Info</span>
                    <Label htmlFor="ice_sales_stacker">Stacker:</Label>
                    <Input id="ice_sales_stacker" type="number" onChange={handleIceSalesStackerChange} value={ice_sales_stacker} />

                    <Label htmlFor="ice_sales_coin">Coin Box:</Label>
                    <Input id="ice_sales_coin" type="number" onChange={handleIceSalesCoinChange} value={ice_sales_coin} />

                    <span className="text-lg font-semibold">Water Coin Calculation</span>
                    <Label htmlFor="water_coin_current">$Box current: </Label>
                    <Input id="water_coin_current" type="number" onChange={handleWaterCoinCurrentChange} value={water_coin_current} />

                    <span className="text-lg font-semibold">Water Bills Calculation</span>
                    <Label htmlFor="water_bills_sales">Water Sales (from SmartIce): </Label>
                    <Input id="water_bills_sales" type="number" onChange={handleWaterBillsSalesChange} value={water_bills_sales} />
                    
                    <Button onClick={startFlow}>Submit</Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          </>
    )
}
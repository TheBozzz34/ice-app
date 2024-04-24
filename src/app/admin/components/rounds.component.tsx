import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  File,
  Home,
  LineChart,
  ListFilter,
  MoreVertical,
  Package,
  Package2,
  PanelLeft,
  Search,
  Settings,
  ShoppingCart,
  Truck,
  Users2,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Separator } from "@/components/ui/separator"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { useState, useEffect } from "react"
import { createClient } from "@/utils/supabase/client"

type Round = {
  id: number
  created_at: string
  site: string
  wf_deposit_date: string
}


function prettyDateTime(date: string) {
  return new Date(date).toLocaleString("en-US");
}

export function RoundView(roundId: any) { // need to type
  const supabase = createClient()
  const [round, setRound] = useState<Round>();
  const [site, setSite] = useState([]);

  useEffect(() => {
    async function fetchRound() {
      try {
        const { data, error } = await supabase
          .from("rounds")
          .select("*")
          .eq("id", roundId.roundId);  // this makes me want to vomit

        if (error) {
          console.error("Error fetching round:", error);
        } else {
          setRound(data[0]);
          setSite(data[0].site);
          console.log(data[0]);
        }
      } catch (error) {
        console.error("Error fetching round:", error);
      }
    }

    fetchRound();
  }, [roundId]);

  async function setDepositDate(date: string) {
    console.log(date);
  }

  async function getSiteInfo(siteId: string) {
    const { data, error } = await supabase
      .from("sites")
      .select("*")
      .eq("id", siteId);

    if (error) {
      console.error("Error fetching site:", error);
    } else {
      setSite(data[0]);
      console.log(data[0]);
    }
  }


  return (
    <div>
            <Card
              className="overflow-hidden" x-chunk="dashboard-05-chunk-4"
            >
              <CardHeader className="flex flex-row items-start bg-muted/50">
                <div className="grid gap-0.5">
                  <CardTitle className="group flex items-center gap-2 text-lg">
                    Round {round?.id}
                    <Button
                      size="icon"
                      variant="outline"
                      className="h-6 w-6 opacity-0 transition-opacity group-hover:opacity-100"
                    >
                      <Copy className="h-3 w-3" />
                      <span className="sr-only">Copy Round ID</span>
                    </Button>
                  </CardTitle>
                  {round?.created_at && (
                    <>
                    <CardDescription>Round Taken: {prettyDateTime(round.created_at)}</CardDescription>
                    <CardDescription>Round Deposited: {prettyDateTime(round.wf_deposit_date)}</CardDescription>
                    </>
                  )}
                </div>
                <div className="ml-auto flex items-center gap-1">
                  <Button size="sm" variant="outline" className="h-8 gap-1">
                    <Truck className="h-3.5 w-3.5" />
                    <span className="lg:sr-only xl:not-sr-only xl:whitespace-nowrap">
                      BUTTON
                    </span>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        <MoreVertical className="h-3.5 w-3.5" />
                        <span className="sr-only">More</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Export</DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>Trash</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="p-6 text-sm">
                <div className="grid gap-3">
                  <div className="font-semibold">Round Details</div>
                  
                  <Separator className="my-2" />
                  <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Deposited Bills</span>
                      <span>$299.00</span>
                    </li>
                    <li className="flex items-center justify-between">
                      <span className="text-muted-foreground">Deposited Coins</span>
                      <span>$5.00</span>
                    </li>

                    <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="outline" className="h-8 w-8">
                        eoaebj
                        <span className="sr-only">Details</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <span>
                        super cool  math
                        </span> 

                    </DropdownMenuContent>
                  </DropdownMenu>

                  </ul>
                </div>
                <Separator className="my-4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-3">
                    <div className="font-semibold">Site Information</div>
                    <address className="grid gap-0.5 not-italic text-muted-foreground">
                      <span>SITE_NAME</span>
                      <span>SITE_ADDRESS_LINE_1</span>
                      <span>SITE_ADDRESS_LINE_2</span>
                    </address>
                  </div>
                </div>
                <Separator className="my-4" />
                <div className="grid gap-3">
                  <div className="font-semibold">Employee Information</div>
                  <dl className="grid gap-3">
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Name</dt>
                      <dd>EMPLOYEE_NAME</dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Email</dt>
                      <dd>
                        <a href="mailto:">EMPLOYEE_EMAIL</a>
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-muted-foreground">Phone</dt>
                      <dd>
                        <a href="tel:">EMPLOYEE_PHONE</a>
                      </dd>
                    </div>
                  </dl>
                </div>
              </CardContent>
              <CardFooter className="flex flex-row items-center border-t bg-muted/50 px-6 py-3">
                <div className="text-xs text-muted-foreground">
                  Deposited <time dateTime="2023-11-23">DEPOSIT_DATE</time>
                </div>
                <Pagination className="ml-auto mr-0 w-auto">
                  <PaginationContent>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronLeft className="h-3.5 w-3.5" />
                        <span className="sr-only">Previous Order</span>
                      </Button>
                    </PaginationItem>
                    <PaginationItem>
                      <Button size="icon" variant="outline" className="h-6 w-6">
                        <ChevronRight className="h-3.5 w-3.5" />
                        <span className="sr-only">Next Order</span>
                      </Button>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </CardFooter>
            </Card>
          </div>
  );
}
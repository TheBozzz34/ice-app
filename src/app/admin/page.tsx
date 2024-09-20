"use client";

import axios from "axios";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft, ChevronRight, ChevronDown, Copy, CreditCard, File,
  Home, LineChart, ListFilter, MoreVertical, Package, Package2,
  PanelLeft, Search, Settings, ShoppingCart, Truck, Users2, User, Circle, Bug, Pencil
} from "lucide-react";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { addDays, format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList,
  BreadcrumbPage, BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card, CardContent, CardDescription, CardFooter,
  CardHeader, CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Pagination, PaginationContent, PaginationItem,
} from "@/components/ui/pagination";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip, TooltipContent, TooltipTrigger,
} from "@/components/ui/tooltip";
import { CircularProgress } from "@mui/material"; // Import CircularProgress from Material UI

import { RoundView } from "@/app/admin/components/rounds.component";
import { createClient } from "@/utils/supabase/client";

type Round = {
  id: number;
  created_at: string;
  round_site: number;
  ice_sales_info_stacker: string;
  created_by: string;
  ice_sales_info_coin_box: number;
};

const sites = new Map<number, string>([
  [0, "Pojoaque"],
  [1, "Alameda"],
  [2, "Moriarty"],
  [3, "Coors"],
  [4, "Sequoia"],
  [5, "Atrisco"],
  [6, "Isleta"],
  [7, "Edgewood"],
]);

const ROLE_THRESHOLD = 25565;

export default function Dashboard() {
  const supabase = createClient();

  const [isFetchingRounds, setIsFetchingRounds] = useState(false);
  const [hasAuthenticated, setHasAuthenticated] = useState(false);
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
    to: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
  });
  const [currentRound, setCurrentRound] = useState<number | null>(null);
  const [rounds, setRounds] = useState<Round[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isUserIdSet, setIsUserIdSet] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [selectedSite, setSelectedSite] = useState(1);
  const [triggerValue, setTriggerValue] = useState(0);
  const [emailToName, setEmailToName] = useState<Map<string, string>>(new Map());

  const fetchData = useCallback(async () => {
    try {
      setIsFetchingRounds(true);
      const jwt = (await supabase.auth.getSession()).data.session?.access_token;
      if (!jwt) {
        throw new Error("No JWT found");
      }
  
      // Convert the date to ISO strings for use in the query parameters
      const fromDate = date?.from ? date.from.toISOString() : "";
      const toDate = date?.to?.toISOString() ?? "";
  
      const response = await fetch(`/api/rounds?from=${encodeURIComponent(fromDate)}&to=${encodeURIComponent(toDate)}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${jwt}` },
      });
  
      if (!response.ok) {
        throw new Error("Failed to fetch rounds");
      }
  
      const data: Round[] = await response.json();
      setRounds(data);
  
      await replaceUUIDWithEmail(data);
    } catch (error) {
      console.error("Error fetching rounds:", error);
    } finally {
      setIsFetchingRounds(false);
    }
  }, [supabase, userId, date]);
  

  const replaceUUIDWithEmail = useCallback(async (rounds: Round[]) => {
    if (!userId) {
      console.warn("User ID is undefined, skipping replaceUUIDWithEmail.");
      return;
    }

    const updatedEmailToName = new Map(emailToName);

    for (const round of rounds) {
      try {
        if (updatedEmailToName.has(round.created_by)) {
          continue;
        }
        const response = await axios.get('https://api.scripkitty.store/getuser', {
          params: {
            uuid: round.created_by,
            userId: userId
          }
        });
        updatedEmailToName.set(round.created_by, response.data.user.user_metadata.first_name + ' ' + response.data.user.user_metadata.last_name);
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    }

    setEmailToName(updatedEmailToName);
    console.log("Email to name:", emailToName);
  }, [emailToName, userId]);


  const auth = useCallback(async () => {
    try {
      const { data: authData, error: authError } = await supabase.auth.getUser();
      if (authError) {
        throw authError;
      }

      const userId = authData?.user?.id;
      if (!userId) {
        throw new Error("No user ID found");
      }
      setUserId(userId);
      setIsUserIdSet(true);  // Trigger that the userId is now set

      const { data: userRoles, error: userRolesError } = await supabase
        .from("users")
        .select("*")
        .eq("email", authData?.user?.email);

      if (userRolesError) {
        throw userRolesError;
      }

      if (userRoles && userRoles.length > 0) {
        const userRole = userRoles[0].role;
        if (typeof userRole === "number" && userRole >= ROLE_THRESHOLD) {
          setHasAuthenticated(true);
        }
      } else {
        throw new Error("No roles found for the user");
      }
    } catch (error) {
      console.error("Authentication error:", error);
    }
  }, [supabase]);

  function trigger() {
    return Math.ceil(Math.random() * 1000);
  }

  const handleRoundEdit = useCallback((roundId: number) => {
    setCurrentRound(roundId);
    setTriggerValue(trigger());
  }, []);

  const exportRounds = useCallback(async () => {
    if (isExporting) return;

    try {
      setIsExporting(true);
      const response = await fetch("https://api.scripkitty.store/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to export rounds");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.style.display = "none";
      a.href = url;
      a.download = "rounds.csv";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error exporting rounds:", error);
    } finally {
      setIsExporting(false);
    }
  }, [isExporting, userId]);

  useEffect(() => {
    if (hasAuthenticated) {
      fetchData();
    } else {
      auth();
    }
  }, [hasAuthenticated, auth, fetchData]);

  // New useEffect that triggers replaceUUIDWithEmail only when userId is set
  useEffect(() => {
    if (isUserIdSet) {
      fetchData(); // Ensure rounds are fetched after the userId is set
    }
  }, [isUserIdSet]);

  function prettyDate(date: string) {
    return new Date(date).toLocaleDateString("en-US");
  }



  /*
    useEffect(() => {
      async function fetchUsers() {
        try {
          // setIsFetchingRounds(true);
          const jwt = (await supabase.auth.getSession()).data.session?.access_token
          if (!jwt) {
            throw new Error('No JWT found');
          } else {
            console.log('Fetching rounds with JWT:', jwt);
            const response = await fetch('/api/employee', {
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${jwt}`,
              },
            });
            if (!response.ok) {
              throw new Error('Failed to fetch rounds');
            }
            const data = await response.json();
            console.log('Fetched rounds:', data); // Log fetched data
            setRounds(data);
          }
        } catch (error) {
          console.error('Error fetching rounds:', error);
        } finally {
          setIsFetchingRounds(false); // Set fetching status to false when fetching ends (success or error)
        }
      }



    }, [])

   */

    useEffect(() => {
      console.log('Date range:', date);
    } , [date]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      {!isFetchingRounds && (
        <>
          <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
            <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
              <Link
                href="#"
                className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
              >
                <Package2 className="h-4 w-4 transition-all group-hover:scale-110" />
                <span className="sr-only">Wheeler Peak Ice</span>
              </Link>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Home className="h-5 w-5" />
                    <span className="sr-only">Rounds</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Rounds</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/admin/employees"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Users2 className="h-5 w-5" />
                    <span className="sr-only">Employees</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Employees</TooltipContent>
              </Tooltip>
            </nav>
            <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <Settings className="h-5 w-5" />
                    <span className="sr-only">Settings</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Settings</TooltipContent>
              </Tooltip>
            </nav>
          </aside>
          <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
            <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
              <Sheet>
                <SheetTrigger asChild>
                  <Button size="icon" variant="outline" className="sm:hidden">
                    <PanelLeft className="h-5 w-5" />
                    <span className="sr-only">Toggle Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                  <nav className="grid gap-6 text-lg font-medium">
                    <Link
                      href="#"
                      className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
                    >
                      <Package2 className="h-5 w-5 transition-all group-hover:scale-110" />
                      <span className="sr-only text-secondary">
                        Wheeler Peak Ice
                      </span>
                    </Link>
                    <Link
                      href="/admin"
                      className="flex items-center gap-4 px-2.5 text-foreground"
                    >
                      <Home className="h-5 w-5" />
                      Rounds
                    </Link>
                    <Link
                      href="/admin/employees"
                      className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                    >
                      <Users2 className="h-5 w-5" />
                      Employees
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
              <Breadcrumb className="hidden md:flex">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="#">Dashboard</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="#">Rounds</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="relative ml-auto flex-1 md:grow-0"></div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="overflow-hidden rounded-full"
                  >
                    <Image
                      src="/placeholder.jpg"
                      width={36}
                      height={36}
                      alt="Avatar"
                      className="overflow-hidden rounded-full"
                    />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>WPI RMS</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <a href="/client" className="flex items-center gap-2">
                      <span>Client Page</span>
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <a href="/logout" className="flex items-center gap-2">
                      <span>Logout</span>
                    </a>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>
            <div className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
              <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-2">
                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
                  <Card
                    className="sm:col-span-2"
                    x-chunk="dashboard-05-chunk-0"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle>Your Rounds</CardTitle>
                      <CardDescription className="max-w-lg text-balance leading-relaxed">
                        Introducing Our Dynamic Rounds Dashboard for Seamless
                        Management and Insightful Analysis.
                      </CardDescription>
                    </CardHeader>
                  </Card>
                  <a href="https://bugs.scripkitty.store/bugzilla/" target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-400 transition-all hover:text-red-700 bg-transparent hover:bg-transparent justify-start border-2 w-fit font-semibold h-14"
                  >
                    <Bug className="h-6 w-6" />
                    Submit a bug
                  </a>
                </div>
                {/*
                <Tabs defaultValue="Alameda">
                  <div className="flex items-center">
                    <TabsList>
                      {sitesArray.map(([id, site]) => (
                        <TabsTrigger key={id} value={site} onClick={() => setSelectedSite(site)}>
                          {site}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                    <div className="ml-auto flex items-center gap-2">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-7 gap-1 text-sm"
                          >
                            <ListFilter className="h-3.5 w-3.5" />
                            <span className="sr-only sm:not-sr-only">Filter</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Filter by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuCheckboxItem checked={depositFilter === 'deposited'} onClick={() => setDepositFilter('deposited')}>
                            Deposited
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem checked={depositFilter === 'pending'} onClick={() => setDepositFilter('pending')}>
                            Pending Deposit
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem checked={depositFilter === 'all'} onClick={() => setDepositFilter('all')}>
                            All Rounds
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm"
                      >
                        <File className="h-3.5 w-3.5" />

                        {isExporting ? (
                          <span className="sr-only sm:not-sr-only">Export in progress...</span>
                        ) : (
                          <span className="sr-only sm:not-sr-only" onClick={exportRounds}>Export</span>
                        )}
                      </Button>
                    </div>
                  </div>


                 {sitesArray.map(([id, site]) => (
                     <TabsContent value={site} key={id}>
                     <Card x-chunk="dashboard-05-chunk-3">
                       <CardHeader className="px-7">
                         <CardTitle>Rounds</CardTitle>
                         <CardDescription>
                           Recently completed rounds
                         </CardDescription>
                       </CardHeader>
                       <CardContent>
                         <Table>
                           <TableHeader>
                             <TableRow>
                               <TableHead>Date</TableHead>
                               <TableHead className="hidden sm:table-cell">
                                 Site
                               </TableHead>
                               <TableHead className="hidden sm:table-cell">
                                 Status
                               </TableHead>
                               <TableHead className="hidden md:table-cell">
                                 Employee
                               </TableHead>
                               <TableHead className="text-right">Amount</TableHead>
                             </TableRow>
                           </TableHeader>
                           <TableBody>
                             {rounds.map((round) => (
                               <TableRow key={round.id}>
                                 <TableCell className="font-medium">{prettyDate(round.created_at)}</TableCell>
                                 <TableCell>{sites.get(round.round_site)}</TableCell>
                                 <TableCell>{round.ice_sales_info_stacker}</TableCell>
                                 <TableCell>{round.created_by}</TableCell>
                                 <TableCell className="text-right">{round.ice_sales_info_coin_box}</TableCell>
                                 <TableCell className="text-right">
                                   <Button
                                     variant="outline"
                                     size="icon"
                                     className="h-8 w-8 mt-2 mr-2"
                                     onClick={() => handleRoundEdit(round.id)}
                                   >
                                     <Pencil className="h-4 w-4" />
                                     <span className="sr-only">Edit</span>
                                   </Button>
                                 </TableCell>
                               </TableRow>
                             ))}
                           </TableBody>
                         </Table>
                       </CardContent>
                     </Card>
                   </TabsContent>
                  ))}

                </Tabs>
                */}

                <Tabs defaultValue="lastMonth">
                  <div className="flex items-center">
                    <div className="ml-auto flex items-center gap-2">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            id="date"
                            variant={"outline"}
                            className={cn(
                              "w-[300px] justify-start text-left font-normal",
                              !date && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date?.from ? (
                              date.to ? (
                                <>
                                  {format(date.from, "LLL dd, y")} -{" "}
                                  {format(date.to, "LLL dd, y")}
                                </>
                              ) : (
                                format(date.from, "LLL dd, y")
                              )
                            ) : (
                              <span>Pick a date</span>
                            )}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            initialFocus
                            mode="range"
                            defaultMonth={date?.from}
                            selected={date}
                            onSelect={setDate}
                            numberOfMonths={2}
                          />
                        </PopoverContent>
                      </Popover>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-10 gap-1 text-sm"
                          >
                            <File className="h-3.5 w-3.5" />
                            {isExporting ? (
                              <span className="sr-only sm:not-sr-only">
                                Export in progress...
                              </span>
                            ) : (
                              <span
                                className="sr-only sm:not-sr-only"
                              >
                                Export
                              </span>
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Export by</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={exportRounds}>
                            Export all rounds
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            Export deposit table
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  <TabsContent value="lastMonth">
                    <Card x-chunk="dashboard-05-chunk-3">
                      <CardHeader className="px-7">
                        <CardTitle>Rounds</CardTitle>
                        <CardDescription>
                          Rounds taken from {date?.from && prettyDate(date.from.toISOString())}{" "}
                          to {prettyDate(date?.to?.toISOString() ?? "")}

                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Site
                              </TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Employee
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Bills
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Coins
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Edit
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {rounds.map((round) => (
                              <TableRow key={round.id}>
                                <TableCell className="font-medium">
                                  {prettyDate(round.created_at)}
                                </TableCell>
                                <TableCell>
                                  {sites.get(round.round_site)}
                                </TableCell>
                                <TableCell>{emailToName.get(round.created_by)}</TableCell>
                                <TableCell>
                                  {round.ice_sales_info_stacker}
                                </TableCell>
                                <TableCell className="text-right">
                                  {round.ice_sales_info_coin_box}
                                </TableCell>
                                <TableCell className="text-right">
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8 mt-2 mr-2"
                                    onClick={() => handleRoundEdit(round.id)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Edit</span>
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="thisMonth">
                    <Card x-chunk="dashboard-05-chunk-3">
                      <CardHeader className="px-7">
                        <CardTitle>Rounds</CardTitle>
                        <CardDescription>
                          Recently completed rounds
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Date</TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Site
                              </TableHead>
                              <TableHead className="hidden sm:table-cell">
                                Status
                              </TableHead>
                              <TableHead className="hidden md:table-cell">
                                Employee
                              </TableHead>
                              <TableHead className="text-right">
                                Amount
                              </TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            Not implemented
                          </TableBody>
                        </Table>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </Tabs>
              </div>
              {currentRound && (
                <RoundView roundId={currentRound} trigger={triggerValue} />
              )}
            </div>
          </div>
        </>
      )}

      {/*
    <div id="permission-denied" className={`fixed inset-0 z-50 items-center justify-center bg-background bg-opacity-90 ${showPermissionDenied ? 'flex' : 'hidden'}`}>
      <div className="flex flex-col items-center gap-4 p-4 bg-primary-foreground rounded-lg">
        <CreditCard className="h-14 w-14 text-primary" />
        <h2 className="text-lg font-semibold text-primary">Permission Denied</h2>
        <p className="text-center text-secondary-foreground">
          You do not have the necessary permissions to view this page. However since this is a demo, you can continue to view the page.
        </p>
        <Button onClick={() => setHasClicked(true)}>Continue</Button>
      </div>
    </div>
    */}

      {isFetchingRounds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-90">
          <CircularProgress color="primary" />{" "}
          {/* Use CircularProgress component */}
        </div>
      )}
    </div>
  );
}

"use client"

import Image from "next/image"
import Link from "next/link"
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
  User
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { RoundView } from "@/app/admin/components/rounds.component"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useState } from "react"
import { Pencil } from "lucide-react"
import { CircularProgress } from "@mui/material"; // Import CircularProgress from Material UI

type Round = {
  id: number
  created_at: string
  round_site: number
  ice_sales_info_stacker: string
  created_by: string
  ice_sales_info_coin_box: number
}



function prettyDate(date: string) {
  return new Date(date).toLocaleDateString('en-US')
}

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

const ROLE_THRESHOLD = 25565;




export default function Dashboard() {
  const supabase = createClient()

  const [isFetchingRounds, setIsFetchingRounds] = useState(false); // New state variable for fetching status
  const [hasClicked, setHasClicked] = useState(false)
  const [hasAuthenticated, setHasAuthenticated] = useState(false)

  function handleRedirection() {
    //redirect('/login');
    console.log('redirecting to login')
  }

  function handleError(error: any) {
    console.error(error);
    handleRedirection();
  }

  const [currentRound, setCurrentRound] = useState<number | null>(null)

  const [rounds, setRounds] = useState<Round[]>([])

  async function fetchRounds() {
    try {
      setIsFetchingRounds(true);
      const jwt = (await supabase.auth.getSession()).data.session?.access_token
      if (!jwt) {
        throw new Error('No JWT found');
      } else {
        console.log('Fetching rounds with JWT:', jwt);
        const response = await fetch('/api/rounds', {
          headers: {
            Authorization: `Bearer ${jwt}`,
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


  async function auth() {

    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Failed to authenticate user:', authError);
      return handleRedirection();
    }

    const userId = authData?.user?.id;
    if (!userId) {
      console.error('No user ID found');
      return handleRedirection();
    }

    const { data: userRoles, error: userRolesError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authData?.user?.email);

    if (userRolesError) {
      return handleError(userRolesError);
    }

    if (userRoles && userRoles.length > 0) {
      const userRole = userRoles[0].role;
      if (typeof userRole === 'number' && userRole >= ROLE_THRESHOLD) {
        console.log('User is authenticated with role:', userRole);
        setHasAuthenticated(true);
      }
    } else {
      console.error('No roles found for the user');
      return handleRedirection();
    }
  }

  useEffect(() => {
    if (!hasAuthenticated) {
      auth();
    }
  }, [])

  useEffect(() => {
    fetchRounds()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleRoundEdit(roundId: number) {
    setCurrentRound(roundId);
    console.log('Editing round:', currentRound);
  }

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="#"
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                  >
                    <LineChart className="h-5 w-5" />
                    <span className="sr-only">Analytics</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">Analytics</TooltipContent>
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
                      <span className="sr-only text-secondary">Wheeler Peak Ice</span>
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
              <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
              </div>
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
                    className="sm:col-span-2" x-chunk="dashboard-05-chunk-0"
                  >
                    <CardHeader className="pb-3">
                      <CardTitle>Your Rounds</CardTitle>
                      <CardDescription className="max-w-lg text-balance leading-relaxed">
                        Introducing Our Dynamic Rounds Dashboard for Seamless
                        Management and Insightful Analysis.
                      </CardDescription>
                    </CardHeader>
                    <CardFooter>
                      <Button>Create New Round</Button>
                    </CardFooter>
                  </Card>
                  <Card x-chunk="dashboard-05-chunk-1">
                    <CardHeader className="pb-2">
                      <CardDescription>This Week</CardDescription>
                      <CardTitle className="text-4xl">$NUMBER</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        NUMBER% from last week
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Progress value={25} aria-label="25% increase" />
                    </CardFooter>
                  </Card>
                  <Card x-chunk="dashboard-05-chunk-2">
                    <CardHeader className="pb-2">
                      <CardDescription>This Month</CardDescription>
                      <CardTitle className="text-4xl">$NUMBER</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-muted-foreground">
                        NUMBER% from last month
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Progress value={12} aria-label="12% increase" />
                    </CardFooter>
                  </Card>
                </div>
                <Tabs defaultValue="week">
                  <div className="flex items-center">
                    <TabsList>
                      <TabsTrigger value="week">Week</TabsTrigger>
                      <TabsTrigger value="month">Month</TabsTrigger>
                      <TabsTrigger value="year">Year</TabsTrigger>
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
                          <DropdownMenuCheckboxItem checked>
                            Fulfilled
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Declined
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem>
                            Refunded
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-7 gap-1 text-sm"
                      >
                        <File className="h-3.5 w-3.5" />
                        <span className="sr-only sm:not-sr-only">Export</span>
                      </Button>
                    </div>
                  </div>
                  <TabsContent value="week">
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
                </Tabs>
              </div>
              {currentRound && <RoundView roundId={currentRound} />}
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
          <CircularProgress color="primary" /> {/* Use CircularProgress component */}
        </div>
      )}


    </div>
  )
}

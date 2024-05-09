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
  User,
  Trash,
} from "lucide-react"
import { CircularProgress } from "@mui/material";
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

type User = {
  id: number
  user: string
  role: number
  created_at: string
  name: string
  email: string
}

const roles = new Map([
  [0, "Employee"],
  [25565, "Owner"],
  [65535, "Admin"],
])


function prettyDate(date: string) {
  return new Date(date).toLocaleDateString('en-US')
}


const ROLE_THRESHOLD = 25565;


export default function Employees() {
  const supabase = createClient()

  const [hasAuthenticated, setHasAuthenticated] = useState(false)

  const [isFetchingRounds, setIsFetchingRounds] = useState(false);
  const [newEmployeeName, setNewEmployeeName] = useState('')
  const [newEmployeeEmail, setNewEmployeeEmail] = useState('')
  const [newEmployeeRole, setNewEmployeeRole] = useState(0)

  const [isEditing, setIsEditing] = useState(false)

  const [userId, setUserId] = useState<string | null>(null)

  function handleRedirection() {
    //redirect('/login');
    console.log('redirecting to login')
  }

  function handleError(error: any) {
    console.error(error);
    handleRedirection();
  }

  const [currentRound, setCurrentRound] = useState<number | null>(null)

  const [users, setUsers] = useState<User[]>([])

  async function fetchUsers() {
    try {
      setIsFetchingRounds(true);
      const jwt = (await supabase.auth.getSession()).data.session?.access_token
      if (!jwt) {
        throw new Error('No JWT found');
      } else {
        console.log('Fetching users with JWT:', jwt);
        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${jwt}`,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }
        const data = await response.json();

        setUsers(data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setIsFetchingRounds(false);
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
    } else {
        setUserId(userId);
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
  }, []); // Empty dependency array ensures this effect runs only once

  useEffect(() => {
    // Fetch users when component mounts
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Empty dependency array ensures this effect runs only once


  function handleRoundEdit(roundId: number) {
    setCurrentRound(roundId);
    console.log('Editing round:', currentRound);
  }

  async function handleEmployeeAdd() {
    console.log('Adding employee');

    const { data, error } = await supabase
      .from('users')
      .insert([
        { role: newEmployeeRole, name: newEmployeeName, email: newEmployeeEmail, id: Math.floor(Math.random() * 256) }
      ])
      .select()

    // Assuming you're in a React component
    fetch('https://api.scripkitty.store/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: newEmployeeEmail,
        name: newEmployeeName,
        userId: userId
      }),
    })
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          console.log(data); // Handle the response data as needed
        })
        .catch(error => {
          console.error('There was a problem with the request:', error);
        });

    if (error) {
      console.error('Failed to add employee:', error);
    } else {
      console.log('Added employee:', data);
      await fetchUsers();
    }
  }

  function handleUserdelete(userId: number) {
    // TODO: Implement user deletion
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
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
                className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent text-accent-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
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
                  href="#"
                  className="flex items-center gap-4 px-2.5 text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Rounds
                </Link>
                <Link
                  href="#"
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
                  <Link href="#">Employees</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="relative ml-auto flex-1 md:grow-0"> {/* Do not remove this div, doing so will hide the avatar */} </div>
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
                  <CardTitle>Your Employees</CardTitle>
                  <CardDescription className="max-w-lg text-balance leading-relaxed">
                    Introducing Our Dynamic Employee Dashboard for Seamless
                    Management and Insightful Analysis.
                  </CardDescription>
                </CardHeader>
                <CardFooter>
                  <Button size="sm" variant="outline" onClick={() => setIsEditing(true)}> Add Employee</Button>
                </CardFooter>
              </Card>
              <Card x-chunk="dashboard-05-chunk-1">
                <CardHeader className="pb-2">
                  <CardDescription>Total Employees</CardDescription>
                  <CardTitle className="text-4xl">{users.length}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    &#123;&#123;PLACEHOLDER&#125;&#125;
                  </div>
                </CardContent>
              </Card>
              {/*
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
              */}
            </div>
            <Tabs defaultValue="e">
              <div className="flex items-center">
                <TabsList>
                  <TabsTrigger value="e">1</TabsTrigger>
                  <TabsTrigger disabled value="o">2</TabsTrigger>
                  <TabsTrigger disabled value="a">3</TabsTrigger>
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
                        Employee
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Owner
                      </DropdownMenuCheckboxItem>
                      <DropdownMenuCheckboxItem>
                        Admin
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
              <TabsContent value="e">
                <Card x-chunk="dashboard-05-chunk-3">
                  <CardHeader className="px-7">
                    <CardTitle>Employees</CardTitle>
                    <CardDescription>
                      Your employees.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Created</TableHead>
                          <TableHead className="hidden sm:table-cell">
                            Email
                          </TableHead>

                          <TableHead className="hidden md:table-cell">
                            Name
                          </TableHead>

                          <TableHead className="hidden md:table-cell">
                            Role
                          </TableHead>
                          <TableHead className="hidden md:table-cell">ID</TableHead>
                          <TableHead >
                            Actions
                          </TableHead>

                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.map((user) => (
                          <TableRow key={user.id}>
                            <TableCell className="font-medium">{prettyDate(user.created_at)}</TableCell>
                            <TableCell className="hidden sm:table-cell">
                                {user.email}
                              </TableCell>
                            <TableCell>{user.name}</TableCell>
                            <TableCell>{roles.get(user.role)} | {user.role}</TableCell>
                            <TableCell>{user.id}</TableCell>
                            <TableCell>
                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => handleRoundEdit(user.id)}
                                disabled
                              >
                                <Pencil className="h-4 w-4" >
                                </Pencil>
                              </Button>

                              <Button
                                size="icon"
                                variant="outline"
                                className="h-6 w-6"
                                onClick={() => handleUserdelete(user.id)}
                              >
                                <Trash className="h-4 w-4 text-red-500">
                                </Trash>
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

          {isEditing &&

            <div className="">
              <div className="flex items-center gap-4 p-4 bg-background rounded-lg border border-muted-foreground">
                <div className="flex-1">

                  <div className="flex flex-col gap-4">
                    <h2 className="text-2xl font-semibold">New Employee</h2>
                    <p className="text-sm text-muted-foreground">
                      Enter the details of the employee.
                    </p>
                    <Separator />
                  </div>

                  <Input
                    type="text"
                    placeholder="Enter employee name"
                    className="mt-4"
                    value={newEmployeeName}
                    onChange={(e) => setNewEmployeeName(e.target.value)}

                  />
                  <Input
                    type="text"
                    placeholder="Enter employee email"
                    className="mt-4"
                    value={newEmployeeEmail}
                    onChange={(e) => setNewEmployeeEmail(e.target.value)}
                  />
                  <Input
                    type="number"
                    placeholder="Enter employee role"
                    className="mt-4"
                    value={newEmployeeRole}
                    onChange={(e) => setNewEmployeeRole(parseInt(e.target.value))}
                  />

                  <Button className="mt-4" onClick={handleEmployeeAdd}>Add Employee</Button>
                  <Button className="mt-4 ml-4" variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>

                </div>
              </div>
            </div>
          }
        </div>
      </div>

      {isFetchingRounds && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background bg-opacity-90">
          <CircularProgress color="primary" /> {/* Use CircularProgress component */}
        </div>
      )}

    </div>
  )
}

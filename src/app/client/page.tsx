"use client"

import Link from "next/link"
import {
  Bell,
  CircleUser,
  Home,
  LineChart,
  Menu,
  Package,
  Package2,
  PackageOpen,
  Search,
  ShoppingCart,
  Users,
  Bug
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import Page2 from "./pages/2.page"
import { useState, useEffect } from "react"
import Page1 from "./pages/1.page"

import { createClient } from "@/utils/supabase/client"
import { useRouter } from 'next/navigation'

const ROLE_THRESHOLD = 0

export default function Dashboard() {
  const supabase = createClient()
  const router = useRouter()

  const [userRole, setUserRole] = useState<number>(0);
  const [activePage, setActivePage] = useState(1)
  const [rounds, setRounds] = useState(0)
  const [loading, setLoading] = useState(true)

  function handleError(error: any) {
    console.error(error)
    router.push("/error")
  }

  async function getUserRoundsCount() {
    const { data: user, error: userError } = await supabase.auth.getUser()
    if (userError || !user?.user) {
      console.error(userError)
      return 0
    }

    const { data, error } = await supabase.from("rounds")
      .select("id")
      .eq("created_by", user?.user?.id)

    if (error) {
      console.error(error)
      return 0
    }

    setRounds(data.length)
  }

  async function auth() {
    const { data: authData, error: authError } = await supabase.auth.getUser();

    if (authError) {
      console.error('Failed to authenticate user:', authError);
      router.push("/error?__message=" + btoa(authError?.message))
      return
    }

    if (!authData) {
      console.error('No user data found');
      router.push("/error?__message=" + btoa('No user data found'))
      return
    }

    const { data: userRoles, error: userRolesError } = await supabase
      .from('users')
      .select('*')
      .eq('email', authData?.user?.email);

    if (userRolesError) {
      handleError(userRolesError);
      return
    }

    if (userRoles && userRoles.length > 0) {
      console.log('User roles:', userRoles);
      const userRole = userRoles[0].role;
      if (typeof userRole === 'number' && userRole < ROLE_THRESHOLD) {
        router.push("/error")
        return
      }
      setUserRole(userRole)
    } else {
      console.error('No roles found for the user');
      router.push("/error")
    }
  }

  useEffect(() => {
    auth().then(() => {
      setLoading(false)
    })
    getUserRoundsCount()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <PackageOpen className="h-6 w-6" />
              <span className="">Wheeler Peak Ice</span>
            </Link>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Button
                onClick={() => setActivePage(1)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary bg-transparent hover:bg-transparent justify-start ${activePage === 1 ? 'text-primary border' : 'text-muted-foreground'}`}
              >
                <Home className="h-4 w-4" />
                Create Round
              </Button>
              <Button
                onClick={() => setActivePage(2)}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary bg-transparent hover:bg-transparent justify-start ${activePage === 2 ? 'text-primary border' : 'text-muted-foreground'}`}
              >
                <ShoppingCart className="h-4 w-4" />
                View Rounds
                <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                  {rounds}
                </Badge>
              </Button>
            </nav>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <Package2 className="h-6 w-6" />
                  <span className="sr-only">Wheeler Peak Ice</span>
                </Link>
                <Button
                  onClick={() => setActivePage(1)}
                  className={`mx-[-0.65rem] flex gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground ${activePage === 1 ? 'text-primary border' : 'text-muted-foreground'}`}
                >
                  <LineChart className="h-5 w-5" />
                  Create Round
                </Button>
                <Button
                  onClick={() => setActivePage(2)}
                  className={`mx-[-0.65rem] flex gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground ${activePage === 2 ? 'text-primary border' : 'text-muted-foreground'}`}
                >
                  <LineChart className="h-5 w-5" />
                  View Rounds
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <a href="https://bugs.scripkitty.store/bugzilla/" target="_blank" rel="noreferrer"
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-red-400 transition-all hover:text-red-700 bg-transparent hover:bg-transparent justify-start border-2 w-fit font-semibold"
            >
              <Bug className="h-6 w-6" />
              Submit a bug
            </a>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Round manager</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {userRole >= ROLE_THRESHOLD && (
                <DropdownMenuItem>
                  <a href="/admin">Owner page</a>
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <a href="/logout">Logout</a>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {activePage === 1 && <Page1 />}
          {activePage === 2 && <Page2 />}
        </div>
      </div>
    </div>
  )
}

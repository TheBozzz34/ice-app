import { Button } from "@/components/ui/button";

export default function Page3() {
    return (
        <>
        <div className="flex items-center">
            <h1 className="text-lg font-semibold md:text-2xl">link 3</h1>
          </div>
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
            <div className="flex flex-col items-center gap-1 text-center">
              <h3 className="text-2xl font-bold tracking-tight">
                bigger text
              </h3>
              <p className="text-sm text-muted-foreground">
                smaller text.
              </p>
              <Button className="mt-4">Add entry</Button>
            </div>
          </div>
          </>
    )
}
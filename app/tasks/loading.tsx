import { Skeleton } from "@/components/ui/skeleton"

export default function TasksLoading() {
  return (
    <div className="container mx-auto p-4 space-y-4">
      <Skeleton className="h-8 w-64" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-3">
          <Skeleton className="h-[600px]" />
        </div>
        <Skeleton className="h-[200px]" />
      </div>
    </div>
  )
} 
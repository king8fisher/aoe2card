import { ReactNode } from "react";


const PageLayout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="flex flex-row gap-2 w-full">
      {children}
    </div>
  )
}

export default PageLayout;
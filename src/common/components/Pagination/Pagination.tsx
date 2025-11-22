import s from "./Pagination.module.css"
import { PageSizeSelector } from "@/common/components/Pagination/PageSizeSelector/PageSizeSelector.tsx"
import { PaginationControls } from "@/common/components/Pagination/PaginationControls/PaginationControls.tsx"

type Props = {
  currentPage: number
  setCurrentPage: (page: number) => void
  pagesCount: number
  pageSize: number
  setPageSize: (size: number) => void
}

export const Pagination = ({ currentPage, setCurrentPage, pagesCount, pageSize, setPageSize }: Props) => {
  if (pagesCount <= 1) return null

  return (
    <div className={s.container}>
      <PaginationControls pagesCount={pagesCount} currentPage={currentPage} setCurrentPage={setCurrentPage} />
      <PageSizeSelector pageSize={pageSize} setPageSize={setPageSize} />
    </div>
  )
}

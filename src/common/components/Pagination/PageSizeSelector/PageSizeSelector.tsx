import s from "./PageSizeSelector.module.css"
type Props = {
  pageSize: number
  setPageSize: (size: number) => void
}

export const PageSizeSelector = ({ pageSize, setPageSize }: Props) => {
  return (
    <label>
      Show
      <select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} className={s.selector}>
        {[4, 8, 16, 32].map((size) => (
          <option value={size} key={size}>
            {size}
          </option>
        ))}
      </select>
      per page
    </label>
  )
}

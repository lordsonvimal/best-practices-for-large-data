type Props = {
  onChange: (pageNo: number) => void,
  pageNo: number,
  pages: number
};

export function Paginate(props: Props) {
  const nextPage = () => props.onChange(props.pageNo + 1);
  const prevPage = () => props.onChange(props.pageNo - 1);
  return (
    <div class="paginate">
      <button class="btn-paginate" disabled={props.pageNo === 1} onClick={prevPage}>{"<"}</button>
      <button class="btn-paginate btn-selected">{props.pageNo}</button>
      <button class="btn-paginate" disabled={props.pageNo === props.pages} onClick={nextPage}>{">"}</button>
      <i class="pages-count">Contains {props.pages} page(s)</i>
    </div>
  );
}

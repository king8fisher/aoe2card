import { Ref } from "react";
import { Input } from "~/src/shadcn/components/ui/input";

interface ISearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading: boolean;
}

const SearchInput = ({ searchTerm, setSearchTerm, ref }: ISearchInputProps & { ref: Ref<HTMLInputElement>; }) => (
  <div className="flex-1 mt-3">
    <Input
      // clearable
      ref={ref}
      type="search"
      placeholder="Search Ctrl+K / Cmd+K"
      value={searchTerm}
      autoFocus
      onInput={(e) => {
        const searchValue = e?.currentTarget?.value;
        setSearchTerm(searchValue);
      }}
    // onSlClear={() => {
    //   setSearchTerm("");
    // }}
    >
      {/* {isLoading ? <SlSpinner slot="prefix" /> : <SlIcon name="search" slot="prefix" />} */}
    </Input>
  </div>
);

export default SearchInput;

import { Input } from "~/src/shadcn/components/ui/input";

interface ISearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading: boolean;
}

const SearchInput = ({ searchTerm, setSearchTerm, isLoading }: ISearchInputProps) => (
  <div className="flex-1 mt-3">
    <Input
      // clearable
      type="search"
      placeholder="Search"
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

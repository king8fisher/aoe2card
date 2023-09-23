import { SlIcon, SlInput, SlSpinner } from "@shoelace-style/shoelace/dist/react";

interface ISearchInputProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  isLoading: boolean;
}

const SearchInput = ({ searchTerm, setSearchTerm, isLoading }: ISearchInputProps) => (
  <div className="flex-1 mt-3">
    <SlInput
      className="search-input"
      clearable
      placeholder="Search"
      value={searchTerm}
      autoFocus
      onInput={(e) => {
        const searchValue = e?.currentTarget?.value;
        setSearchTerm(searchValue);
      }}
      onSlClear={() => {
        setSearchTerm("");
      }}
    >
      {isLoading ? <SlSpinner slot="prefix" /> : <SlIcon name="search" slot="prefix" />}
    </SlInput>
  </div>
);

export default SearchInput;

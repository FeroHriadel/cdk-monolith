export interface MultiselectProps {
  items: { label: string; value: any }[];
  onItemClick: (item: any) => void;
  selectedItems: any[];
  title: string;
}
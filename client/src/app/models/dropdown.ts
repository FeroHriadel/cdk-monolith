export interface DropdownProps {
  buttonLabel: string;
  items: {itemLabel: string, itemValue: any}[]
  onClick: (vale: any) => void
}
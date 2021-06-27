export type ListItem = ListItemClass;
export class ListItemClass extends Object {
  name!: string;
  constructor(nameInput: string) {
    super();
    this.name = nameInput;
  }
}
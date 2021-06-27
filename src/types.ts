export type ListItem = ListItemClass;
export interface ListItemAttributes {
  name: string;
  id: number;
  route: string;
}
export class ListItemClass extends Object {
  name!: string;
  id!: number;
  route!: string;
  constructor(attributes: ListItemAttributes) {
    super();
    const { name, id, route } = attributes;
    this.name = name;
    this.id = id;
    this.route = route;
  }
}
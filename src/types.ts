export type ListItem = ListItemClass;
/**
 * image will be a URL link to get load an image
 */
export interface ListItemAttributes {
  name: string;
  id: number;
  image: string;
  route: string;
}
export class ListItemClass extends Object {
  name!: string;
  id!: number;
  image!: string;
  route!: string;
  constructor(attributes: ListItemAttributes) {
    super();
    const { name, id, route, image } = attributes;
    this.name = name;
    this.id = id;
    this.image = image;
    this.route = route;
  }
}
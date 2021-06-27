/**
 * image will be a URL link to get load an image
 */
export interface Memory {
  id: number;
  name: string;
  image: string;
  description: string;
  route: string;
}
export class ListItemClass extends Object implements Memory { 
  id!: number;
  name!: string;
  description!: string;
  image!: string;
  route!: string;
  constructor(memory: Memory) {
    super();
    Object.assign(this, {
      ...memory
    });
  }
}
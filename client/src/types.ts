/**
 * image will be a URL link to get load an image
 */
export interface Memory extends Object {
  id: number;
  name: string;
  image: string;
  description: string;
  route: string;
}
export class ListItemClass implements Memory { 
  id!: number; route!: string; name!: string; description!: string; image!: string;
  constructor(memory: Memory) {
    Object.assign(this, {
      ...memory
    });
  }
}

export interface RegisterResponse {
  register: {
      errors: null 
      | [{
        field: string;
        message: string;
      }];
      user: null 
      | {
          email: string;
      };
  };
}
interface IFilter {
  skip?: number;
  take?: number;
  include?: any;
}

export class BaseFilter<T, K extends IFilter> {
  where = <T>{};
  include = <K['include']>{};
  skip: number = 0;
  take: number = 10;

  constructor(filter?: K, where?: T) {
    this.where = {} as T;
    this.include = {} as K['include'];

    this.where = {
      ...this.where,
      ...where,
    };

    if (filter?.skip) {
      this.skip = filter.skip;
    } else {
      this.skip = 0;
    }

    if (filter?.take) {
      this.take = filter.take;
    } else {
      this.take = 10;
    }
  }
}

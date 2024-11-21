/** Types generated for queries found in "src/reviews/queries/reviews.queries.sql" */
import { PreparedQuery } from '@pgtyped/runtime';

/** 'GetReviews' parameters type */
export type IGetReviewsParams = void;

/** 'GetReviews' return type */
export interface IGetReviewsResult {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

/** 'GetReviews' query type */
export interface IGetReviewsQuery {
  params: IGetReviewsParams;
  result: IGetReviewsResult;
}

const getReviewsIR: any = {
  usedParamSet: {},
  params: [],
  statement: 'SELECT *\nFROM reviews',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM reviews
 * ```
 */
export const getReviews = new PreparedQuery<
  IGetReviewsParams,
  IGetReviewsResult
>(getReviewsIR);

/** 'GetReviewsById' parameters type */
export interface IGetReviewsByIdParams {
  id?: string | null | void;
}

/** 'GetReviewsById' return type */
export interface IGetReviewsByIdResult {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

/** 'GetReviewsById' query type */
export interface IGetReviewsByIdQuery {
  params: IGetReviewsByIdParams;
  result: IGetReviewsByIdResult;
}

const getReviewsByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 33, b: 35 }],
    },
  ],
  statement: 'SELECT *\nFROM reviews\nWHERE id = :id',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM reviews
 * WHERE id = :id
 * ```
 */
export const getReviewsById = new PreparedQuery<
  IGetReviewsByIdParams,
  IGetReviewsByIdResult
>(getReviewsByIdIR);

/** 'GetReviewsWithFilters' parameters type */
export interface IGetReviewsWithFiltersParams {
  productId?: string | null | void;
  rating?: number | null | void;
  userId?: string | null | void;
}

/** 'GetReviewsWithFilters' return type */
export interface IGetReviewsWithFiltersResult {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

/** 'GetReviewsWithFilters' query type */
export interface IGetReviewsWithFiltersQuery {
  params: IGetReviewsWithFiltersParams;
  result: IGetReviewsWithFiltersResult;
}

const getReviewsWithFiltersIR: any = {
  usedParamSet: { productId: true, userId: true, rating: true },
  params: [
    {
      name: 'productId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 52, b: 61 }],
    },
    {
      name: 'userId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 105, b: 111 }],
    },
    {
      name: 'rating',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 152, b: 158 }],
    },
  ],
  statement:
    'SELECT *\nFROM reviews\nWHERE ("productId" = COALESCE(:productId, "productId"))\n  AND ("userId" = COALESCE(:userId, "userId"))\n  AND ("rating" = COALESCE(:rating, "rating"))',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM reviews
 * WHERE ("productId" = COALESCE(:productId, "productId"))
 *   AND ("userId" = COALESCE(:userId, "userId"))
 *   AND ("rating" = COALESCE(:rating, "rating"))
 * ```
 */
export const getReviewsWithFilters = new PreparedQuery<
  IGetReviewsWithFiltersParams,
  IGetReviewsWithFiltersResult
>(getReviewsWithFiltersIR);

/** 'GetReviewsByProductId' parameters type */
export interface IGetReviewsByProductIdParams {
  productId?: string | null | void;
}

/** 'GetReviewsByProductId' return type */
export interface IGetReviewsByProductIdResult {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

/** 'GetReviewsByProductId' query type */
export interface IGetReviewsByProductIdQuery {
  params: IGetReviewsByProductIdParams;
  result: IGetReviewsByProductIdResult;
}

const getReviewsByProductIdIR: any = {
  usedParamSet: { productId: true },
  params: [
    {
      name: 'productId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 42, b: 51 }],
    },
  ],
  statement: 'SELECT *\nFROM reviews\nWHERE "productId" = :productId',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM reviews
 * WHERE "productId" = :productId
 * ```
 */
export const getReviewsByProductId = new PreparedQuery<
  IGetReviewsByProductIdParams,
  IGetReviewsByProductIdResult
>(getReviewsByProductIdIR);

/** 'GetReviewsByUserId' parameters type */
export interface IGetReviewsByUserIdParams {
  userId?: string | null | void;
}

/** 'GetReviewsByUserId' return type */
export interface IGetReviewsByUserIdResult {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

/** 'GetReviewsByUserId' query type */
export interface IGetReviewsByUserIdQuery {
  params: IGetReviewsByUserIdParams;
  result: IGetReviewsByUserIdResult;
}

const getReviewsByUserIdIR: any = {
  usedParamSet: { userId: true },
  params: [
    {
      name: 'userId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 39, b: 45 }],
    },
  ],
  statement: 'SELECT *\nFROM reviews\nWHERE "userId" = :userId',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM reviews
 * WHERE "userId" = :userId
 * ```
 */
export const getReviewsByUserId = new PreparedQuery<
  IGetReviewsByUserIdParams,
  IGetReviewsByUserIdResult
>(getReviewsByUserIdIR);

/** 'CreateReviews' parameters type */
export interface ICreateReviewsParams {
  comment?: string | null | void;
  id?: string | null | void;
  productId?: string | null | void;
  rating?: number | null | void;
  userId?: string | null | void;
}

/** 'CreateReviews' return type */
export interface ICreateReviewsResult {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

/** 'CreateReviews' query type */
export interface ICreateReviewsQuery {
  params: ICreateReviewsParams;
  result: ICreateReviewsResult;
}

const createReviewsIR: any = {
  usedParamSet: {
    id: true,
    comment: true,
    rating: true,
    productId: true,
    userId: true,
  },
  params: [
    {
      name: 'id',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 79, b: 81 }],
    },
    {
      name: 'comment',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 84, b: 91 }],
    },
    {
      name: 'rating',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 94, b: 100 }],
    },
    {
      name: 'productId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 103, b: 112 }],
    },
    {
      name: 'userId',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 115, b: 121 }],
    },
  ],
  statement:
    'INSERT INTO reviews ("id", "comment", "rating", "productId", "userId")\nVALUES (:id, :comment, :rating, :productId, :userId) RETURNING *',
};

/**
 * Query generated from SQL:
 * ```
 * INSERT INTO reviews ("id", "comment", "rating", "productId", "userId")
 * VALUES (:id, :comment, :rating, :productId, :userId) RETURNING *
 * ```
 */
export const createReviews = new PreparedQuery<
  ICreateReviewsParams,
  ICreateReviewsResult
>(createReviewsIR);

/** 'GetProductById' parameters type */
export interface IGetProductByIdParams {
  id?: string | null | void;
}

/** 'GetProductById' return type */
export interface IGetProductByIdResult {
  description: string;
  id: string;
  name: string;
  price: string;
  stock: number;
}

/** 'GetProductById' query type */
export interface IGetProductByIdQuery {
  params: IGetProductByIdParams;
  result: IGetProductByIdResult;
}

const getProductByIdIR: any = {
  usedParamSet: { id: true },
  params: [
    {
      name: 'id',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 34, b: 36 }],
    },
  ],
  statement: 'SELECT *\nFROM products\nWHERE id = :id',
};

/**
 * Query generated from SQL:
 * ```
 * SELECT *
 * FROM products
 * WHERE id = :id
 * ```
 */
export const getProductById = new PreparedQuery<
  IGetProductByIdParams,
  IGetProductByIdResult
>(getProductByIdIR);

/** 'UpdateReview' parameters type */
export interface IUpdateReviewParams {
  comment?: string | null | void;
  id?: string | null | void;
  rating?: number | null | void;
}

/** 'UpdateReview' return type */
export interface IUpdateReviewResult {
  comment: string;
  id: string;
  productId: string;
  rating: number;
  userId: string;
}

/** 'UpdateReview' query type */
export interface IUpdateReviewQuery {
  params: IUpdateReviewParams;
  result: IUpdateReviewResult;
}

const updateReviewIR: any = {
  usedParamSet: { comment: true, rating: true, id: true },
  params: [
    {
      name: 'comment',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 40, b: 47 }],
    },
    {
      name: 'rating',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 87, b: 93 }],
    },
    {
      name: 'id',
      required: false,
      transform: { type: 'scalar' },
      locs: [{ a: 117, b: 119 }],
    },
  ],
  statement:
    'UPDATE reviews\nSET "comment" = COALESCE(:comment, "comment"),\n    "rating"  = COALESCE(:rating, "rating")\nWHERE id = :id RETURNING *',
};

/**
 * Query generated from SQL:
 * ```
 * UPDATE reviews
 * SET "comment" = COALESCE(:comment, "comment"),
 *     "rating"  = COALESCE(:rating, "rating")
 * WHERE id = :id RETURNING *
 * ```
 */
export const updateReview = new PreparedQuery<
  IUpdateReviewParams,
  IUpdateReviewResult
>(updateReviewIR);

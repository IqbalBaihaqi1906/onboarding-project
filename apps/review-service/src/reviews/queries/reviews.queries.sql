/* @name getReviews */
SELECT *
FROM reviews;

/* @name getReviewsById */
SELECT *
FROM reviews
WHERE id = :id;

/* @name getReviewsWithFilters */
SELECT *
FROM reviews
WHERE ("productId" = COALESCE(:productId, "productId"))
  AND ("userId" = COALESCE(:userId, "userId"))
  AND ("rating" = COALESCE(:rating, "rating"));

/* @name getReviewsByProductId */
SELECT *
FROM reviews
WHERE "productId" = :productId;

/* @name getReviewsByUserId */
SELECT *
FROM reviews
WHERE "userId" = :userId;

/* @name createReviews */
INSERT INTO reviews ("id", "comment", "rating", "productId", "userId")
VALUES (:id, :comment, :rating, :productId, :userId) RETURNING *;

/* @name getProductById */
SELECT *
FROM products
WHERE id = :id;

/* @name updateReview */
UPDATE reviews
SET "comment" = COALESCE(:comment, "comment"),
    "rating"  = COALESCE(:rating, "rating")
WHERE id = :id RETURNING *;
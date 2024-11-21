
/* @name Get All Reviews */
select * from reviews r;

/* @name Get Review By Id */
select * from reviews r where r.id = :id;

/* @name Get Reviews By Product Id */
select * from reviews r where r.productId = :productId;

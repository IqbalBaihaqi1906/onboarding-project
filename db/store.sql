-- CreateEnum
CREATE TYPE "RoleUser" AS ENUM ('ADMIN', 'CUSTOMER');

-- CreateTable
CREATE TABLE "users"
(
    "id"       TEXT       NOT NULL,
    "username" TEXT       NOT NULL,
    "password" TEXT       NOT NULL,
    "role"     "RoleUser" NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "products"
(
    "id"          TEXT            NOT NULL,
    "name"        TEXT            NOT NULL,
    "description" TEXT            NOT NULL,
    "stock"       INTEGER         NOT NULL,
    "price"       DECIMAL(65, 30) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews"
(
    "id"        TEXT    NOT NULL,
    "comment"   TEXT    NOT NULL,
    "rating"    INTEGER NOT NULL,
    "userId"    TEXT    NOT NULL,
    "productId" TEXT    NOT NULL,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users" ("username");

ALTER TABLE "products"
    ALTER COLUMN "price" SET DATA TYPE DECIMAL(10, 2);

-- CreateTable
CREATE TABLE "news"
(
    "id"          TEXT         NOT NULL,
    "title"       TEXT         NOT NULL,
    "description" TEXT         NOT NULL,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id")
);

-- CreateEnum
CREATE TYPE "AuctionStatus" AS ENUM ('WAITING', 'ONGOING', 'CLOSED');

-- CreateTable
CREATE TABLE "auctions"
(
    "id"         TEXT            NOT NULL,
    "productId"  TEXT            NOT NULL,
    "highestBid" DECIMAL(10, 2),
    "userId"     TEXT            NOT NULL,
    "status"     "AuctionStatus" NOT NULL DEFAULT 'WAITING',
    "createdAt"  TIMESTAMP(3)    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auctions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "auctions"
    ADD CONSTRAINT "auctions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auctions"
    ADD CONSTRAINT "auctions_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- DropForeignKey
ALTER TABLE "auctions" DROP CONSTRAINT "auctions_userId_fkey";

-- AlterTable
ALTER TABLE "auctions"
    ALTER COLUMN "userId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "auctions"
    ADD CONSTRAINT "auctions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE;


-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'PAID');

-- CreateTable
CREATE TABLE "orders"
(
    "id"          TEXT           NOT NULL,
    "userId"      TEXT           NOT NULL,
    "status"      "OrderStatus"  NOT NULL DEFAULT 'PENDING',
    "totalAmount" DECIMAL(10, 2) NOT NULL,
    "createdAt"   TIMESTAMP(3)   NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_items"
(
    "id"        TEXT           NOT NULL,
    "orderId"   TEXT           NOT NULL,
    "productId" TEXT           NOT NULL,
    "quantity"  INTEGER        NOT NULL,
    "price"     DECIMAL(10, 2) NOT NULL,

    CONSTRAINT "order_items_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders"
    ADD CONSTRAINT "orders_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items"
    ADD CONSTRAINT "order_items_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "orders" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_items"
    ADD CONSTRAINT "order_items_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

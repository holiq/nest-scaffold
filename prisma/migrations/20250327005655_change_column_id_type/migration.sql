/*
  Warnings:

  - The primary key for the `_PermissionToRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `permissions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `permissions` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `pivot_role_permission` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `pivot_user_role` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `roles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `roles` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `A` on the `_PermissionToRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_PermissionToRole` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `pivot_role_permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `permissionId` on the `pivot_role_permission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `roleId` on the `pivot_user_role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_A_fkey";

-- DropForeignKey
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_B_fkey";

-- DropForeignKey
ALTER TABLE "pivot_role_permission" DROP CONSTRAINT "pivot_role_permission_permissionId_fkey";

-- DropForeignKey
ALTER TABLE "pivot_role_permission" DROP CONSTRAINT "pivot_role_permission_roleId_fkey";

-- DropForeignKey
ALTER TABLE "pivot_user_role" DROP CONSTRAINT "pivot_user_role_roleId_fkey";

-- AlterTable
ALTER TABLE "_PermissionToRole" DROP CONSTRAINT "_PermissionToRole_AB_pkey",
DROP COLUMN "A",
ADD COLUMN     "A" UUID NOT NULL,
DROP COLUMN "B",
ADD COLUMN     "B" UUID NOT NULL,
ADD CONSTRAINT "_PermissionToRole_AB_pkey" PRIMARY KEY ("A", "B");

-- AlterTable
ALTER TABLE "permissions" DROP CONSTRAINT "permissions_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "permissions_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "pivot_role_permission" DROP CONSTRAINT "pivot_role_permission_pkey",
DROP COLUMN "roleId",
ADD COLUMN     "roleId" UUID NOT NULL,
DROP COLUMN "permissionId",
ADD COLUMN     "permissionId" UUID NOT NULL,
ADD CONSTRAINT "pivot_role_permission_pkey" PRIMARY KEY ("roleId", "permissionId");

-- AlterTable
ALTER TABLE "pivot_user_role" DROP CONSTRAINT "pivot_user_role_pkey",
DROP COLUMN "roleId",
ADD COLUMN     "roleId" UUID NOT NULL,
ADD CONSTRAINT "pivot_user_role_pkey" PRIMARY KEY ("userId", "roleId");

-- AlterTable
ALTER TABLE "roles" DROP CONSTRAINT "roles_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL DEFAULT gen_random_uuid(),
ADD CONSTRAINT "roles_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE INDEX "_PermissionToRole_B_index" ON "_PermissionToRole"("B");

-- AddForeignKey
ALTER TABLE "pivot_user_role" ADD CONSTRAINT "pivot_user_role_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_role_permission" ADD CONSTRAINT "pivot_role_permission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pivot_role_permission" ADD CONSTRAINT "pivot_role_permission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_A_fkey" FOREIGN KEY ("A") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PermissionToRole" ADD CONSTRAINT "_PermissionToRole_B_fkey" FOREIGN KEY ("B") REFERENCES "roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

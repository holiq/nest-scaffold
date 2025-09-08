import { Expose, Transform } from 'class-transformer';

export class RoleVm {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  displayName: string;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Expose()
  @Transform(({ obj }) => {
    if (obj.pivotRolePermission && obj.pivotRolePermission.length) {
      return obj.pivotRolePermission.map(
        (rolePermission: {
          permission: { id: string; name: string; displayName: string };
        }) => ({
          id: rolePermission.permission?.id,
          name: rolePermission.permission?.name,
          displayName: rolePermission.permission?.displayName,
        }),
      );
    } else if (obj.permissions && obj.permissions.length) {
      return obj.permissions.map(
        (permission: { id: string; name: string; displayName: string }) => ({
          id: permission.id,
          name: permission.name,
          displayName: permission.displayName,
        }),
      );
    } else {
      return [];
    }
  })
  permissions: Array<{
    id: string;
    name: string;
    displayName: string;
  }>;
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class PermissionsGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredPermission = this.reflector.getAllAndOverride<string>(PERMISSION_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredPermission) {
            return true;
        }

        const { user } = context.switchToHttp().getRequest();

        // 1. Super Admin Bypass (Rule 19.3)
        if (user && user.isSuperAdmin) {
            return true;
        }

        // 2. Check Permissions (Placeholder for now, assuming permissions will be in JWT or DB later)
        // For now, we fail closed if not super admin, unless we implement permission array on User
        // Rule 19.2 Fail-Closed
        if (!user || !user.permissions) {
            return false;
        }

        return user.permissions.includes(requiredPermission);
    }
}

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import {JwtService} from "@nestjs/jwt";

@Injectable()
export class IsAdminGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService) {}

    canActivate(
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();

        // @ts-ignore
        const email = (this.jwtService.decode(request.headers.authorization.split(' ')[1]).email)

        return this.isAdmin(email);
    }

    isAdmin(email: string) {
        return email === 'onosov@gmail.com'
    }
}
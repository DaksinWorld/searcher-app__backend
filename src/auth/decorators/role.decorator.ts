import { SetMetadata } from "@nestjs/common";
import { Role } from "../auth.constants";

export const Roles = (...roles: Role[]) => SetMetadata("roles", roles);
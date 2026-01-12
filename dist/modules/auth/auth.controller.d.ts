import type { AuthService } from "./auth.service.js";
import type { ActionController } from "../../types/express.js";
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login: ActionController;
    refresh: ActionController;
    logout: ActionController;
}
//# sourceMappingURL=auth.controller.d.ts.map
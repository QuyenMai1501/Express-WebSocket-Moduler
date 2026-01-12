import type { UserService } from "./user.service.js";
import type { ActionController } from "../../types/express.js";
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    private toUserDto;
    list: ActionController;
    register: ActionController;
    getById: ActionController;
    getByEmail: ActionController;
    updatePut: ActionController;
    updatePatch: ActionController;
    delete: ActionController;
}
//# sourceMappingURL=user.controller.d.ts.map
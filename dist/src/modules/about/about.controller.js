"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AboutAdminController = void 0;
const common_1 = require("@nestjs/common");
const about_dto_1 = require("./dto/about.dto");
const about_service_1 = require("./about.service");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const role_enum_1 = require("../../common/enum/role.enum");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
let AboutAdminController = class AboutAdminController {
    aboutService;
    constructor(aboutService) {
        this.aboutService = aboutService;
    }
    getAbout() {
        return this.aboutService.getAbout();
    }
    upsertAbout(dto) {
        return this.aboutService.upsertAbout(dto);
    }
};
exports.AboutAdminController = AboutAdminController;
__decorate([
    (0, common_1.Get)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], AboutAdminController.prototype, "getAbout", null);
__decorate([
    (0, common_1.Post)(),
    (0, roles_decorator_1.Roles)(role_enum_1.Role.ADMIN),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [about_dto_1.UpsertAboutDto]),
    __metadata("design:returntype", void 0)
], AboutAdminController.prototype, "upsertAbout", null);
exports.AboutAdminController = AboutAdminController = __decorate([
    (0, common_1.Controller)("admin/about"),
    __metadata("design:paramtypes", [about_service_1.AboutService])
], AboutAdminController);
//# sourceMappingURL=about.controller.js.map
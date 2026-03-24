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
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkspaceMember = exports.Role = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const workspace_entity_1 = require("./workspace.entity");
var Role;
(function (Role) {
    Role["OWNER"] = "OWNER";
    Role["ADMIN"] = "ADMIN";
    Role["MEMBER"] = "MEMBER";
    Role["OBSERVER"] = "OBSERVER";
})(Role || (exports.Role = Role = {}));
let WorkspaceMember = class WorkspaceMember {
};
exports.WorkspaceMember = WorkspaceMember;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], WorkspaceMember.prototype, "user_id", void 0);
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], WorkspaceMember.prototype, "workspace_id", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], WorkspaceMember.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => workspace_entity_1.Workspace),
    (0, typeorm_1.JoinColumn)({ name: 'workspace_id' }),
    __metadata("design:type", workspace_entity_1.Workspace)
], WorkspaceMember.prototype, "workspace", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: Role,
        default: Role.MEMBER,
    }),
    __metadata("design:type", String)
], WorkspaceMember.prototype, "role", void 0);
exports.WorkspaceMember = WorkspaceMember = __decorate([
    (0, typeorm_1.Entity)('workspace_members')
], WorkspaceMember);
//# sourceMappingURL=workspace-member.entity.js.map
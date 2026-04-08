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
exports.Workspace = exports.WorkspaceStatus = void 0;
const typeorm_1 = require("typeorm");
const board_entity_1 = require("../../boards/entities/board.entity");
const workspace_member_entity_1 = require("./workspace-member.entity");
var WorkspaceStatus;
(function (WorkspaceStatus) {
    WorkspaceStatus["ACTIVE"] = "ACTIVE";
    WorkspaceStatus["DELETED"] = "DELETED";
})(WorkspaceStatus || (exports.WorkspaceStatus = WorkspaceStatus = {}));
let Workspace = class Workspace {
};
exports.Workspace = Workspace;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Workspace.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workspace.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: WorkspaceStatus,
        default: WorkspaceStatus.ACTIVE,
    }),
    __metadata("design:type", String)
], Workspace.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Workspace.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Workspace.prototype, "slug", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], Workspace.prototype, "logo_url", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], Workspace.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => board_entity_1.Board, (board) => board.workspace),
    __metadata("design:type", Array)
], Workspace.prototype, "boards", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => workspace_member_entity_1.WorkspaceMember, (member) => member.workspace),
    __metadata("design:type", Array)
], Workspace.prototype, "members", void 0);
exports.Workspace = Workspace = __decorate([
    (0, typeorm_1.Entity)('workspaces'),
    (0, typeorm_1.Index)(['slug'], { unique: true, where: "\"status\" != 'DELETED'" })
], Workspace);
//# sourceMappingURL=workspace.entity.js.map
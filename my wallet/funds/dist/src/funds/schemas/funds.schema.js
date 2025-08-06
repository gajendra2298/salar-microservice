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
exports.FundsSchema = exports.Funds = exports.FundStatus = exports.FundType = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
var FundType;
(function (FundType) {
    FundType["SPONSOR_COMMISSION"] = "Sponser Commission";
    FundType["AUR_COMMISSION"] = "Aur Commission";
    FundType["GAME_COMMISSION"] = "Game Commission";
    FundType["FUNDS"] = "Funds";
    FundType["PRT_COMMISSION"] = "PRT Commission";
})(FundType || (exports.FundType = FundType = {}));
var FundStatus;
(function (FundStatus) {
    FundStatus["PENDING"] = "Pending";
    FundStatus["FAILED"] = "Failed";
    FundStatus["SUCCESS"] = "Success";
})(FundStatus || (exports.FundStatus = FundStatus = {}));
let Funds = class Funds {
};
exports.Funds = Funds;
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", mongoose_2.Types.ObjectId)
], Funds.prototype, "userId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true }),
    __metadata("design:type", String)
], Funds.prototype, "receiverUserId", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(FundType),
        required: true
    }),
    __metadata("design:type", String)
], Funds.prototype, "type", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Number, required: true }),
    __metadata("design:type", Number)
], Funds.prototype, "amount", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String, required: true, unique: true }),
    __metadata("design:type", String)
], Funds.prototype, "transactionNo", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(FundStatus),
        default: FundStatus.PENDING
    }),
    __metadata("design:type", String)
], Funds.prototype, "status", void 0);
exports.Funds = Funds = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], Funds);
exports.FundsSchema = mongoose_1.SchemaFactory.createForClass(Funds);
//# sourceMappingURL=funds.schema.js.map
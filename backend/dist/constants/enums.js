"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LeadSource = exports.LeadStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "Admin";
    UserRole["SALES"] = "Sales User";
})(UserRole || (exports.UserRole = UserRole = {}));
var LeadStatus;
(function (LeadStatus) {
    LeadStatus["NEW"] = "New";
    LeadStatus["CONTACTED"] = "Contacted";
    LeadStatus["QUALIFIED"] = "Qualified";
    LeadStatus["LOST"] = "Lost";
})(LeadStatus || (exports.LeadStatus = LeadStatus = {}));
var LeadSource;
(function (LeadSource) {
    LeadSource["WEBSITE"] = "Website";
    LeadSource["INSTAGRAM"] = "Instagram";
    LeadSource["REFERRAL"] = "Referral";
})(LeadSource || (exports.LeadSource = LeadSource = {}));

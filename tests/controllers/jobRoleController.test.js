import { vi, describe, it, expect, beforeEach } from "vitest";
import { JobRoleController } from "../../src/controllers/jobRoleController";
import { mockJobRoles } from "../mockJobRoles";
const mockRequest = {
    params: {},
    query: {},
    body: {},
};
const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
};
const mockJobRoleService = {
    findAllJobRoles: vi.fn()
};
describe("JobRoleController - getAllJobRoles", async () => {
    let jobRoleController;
    beforeEach(() => {
        jobRoleController = new JobRoleController(mockJobRoleService);
        vi.clearAllMocks();
    });
    it("should return all open job roles with status 200", async () => {
        mockJobRoleService.findAllJobRoles = vi.fn().mockResolvedValue(mockJobRoles);
        await jobRoleController.getAllJobRoles(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockJobRoles);
    });
    it("should return status 500 when an error occurs", async () => {
        mockJobRoleService.findAllJobRoles = vi.fn().mockRejectedValue(new Error("Service error"));
        await jobRoleController.getAllJobRoles(mockRequest, mockResponse);
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: "Internal server error" });
    });
});

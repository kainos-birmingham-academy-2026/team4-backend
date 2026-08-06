import { vi, describe, it, expect, beforeEach } from "vitest";
import { JobRoleController } from "../../src/controllers/jobRoleController";
import { JobRoleService } from "../../src/services/jobRoleService";
import { Request, Response } from "express";

const mockRequest = {
    params: {},
    query: {},
    body: {},
} as unknown as Request;

const mockResponse = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn()
} as unknown as Response;

const mockJobRoleService = {
    findAllJobRoles: vi.fn()
} as unknown as JobRoleService;

const mockJobRole1 = {
    id: 1,
    title: "Software Engineer",
    description: "Develop and maintain software applications.",
    location: "Remote",
    isOpen: true
};

const mockJobRole2 = {
    id: 2,
    title: "Product Manager",
    description: "Oversee product development and strategy.",
    location: "New York",
    isOpen: true
};

const mockJobRoles = [mockJobRole1, mockJobRole2];

describe("JobRoleController - getAllJobRoles", async () => {
    let jobRoleController: JobRoleController;

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
    })
})


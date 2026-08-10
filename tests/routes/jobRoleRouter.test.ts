import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import express from "express";
import { createJobRoleRouter } from "../../src/routes/jobRoleRouter";
import { JobRoleService } from "../../src/services/jobRoleService";
import { mockJobRoles } from "../mockJobRoles";

vi.mock("../../src/services/jobRoleService");

const mockFindAllJobRoles = vi.fn().mockResolvedValue(mockJobRoles);
const mockService = new (vi.mocked(JobRoleService))();


const testApp = express();
testApp.use(express.json());
testApp.use(express.urlencoded({ extended: true }));
testApp.use("/api/job-roles", createJobRoleRouter(mockService));

describe("GET /api/job-roles", async () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return all open job roles with status 200", async () => {

        mockService.findAllJobRoles = mockFindAllJobRoles;
        
        const response = await request(testApp).get("/api/job-roles/");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockJobRoles);
    })
});



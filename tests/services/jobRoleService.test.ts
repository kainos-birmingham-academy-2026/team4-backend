import {vi, describe, it, expect, beforeEach} from "vitest";
import {JobRoleService} from "../../src/services/jobRoleService";
import {mockJobRoles, mockJobRoleResponses} from "../mockJobRoles";
import prisma from "../../src/prismaClient";

const mapJobRoleToResponseMock = vi.fn();

vi.mock("../../src/prismaClient", () => ({
    default: {
        jobRole: {
            findMany: vi.fn()
        },
        capability: {
            findUnique: vi.fn()
        },
        band: {
            findUnique: vi.fn()
        }
    }
}));

vi.mock("../../src/mappers/jobRoleMapper", () => ({
    JobRoleMapper: vi.fn(function (this: { mapJobRoleToResponse: typeof mapJobRoleToResponseMock }) {
        this.mapJobRoleToResponse = mapJobRoleToResponseMock;
    }),
}));

describe("JobRoleService - findAllJobRoles", () => {
    let jobRoleService: JobRoleService;
    
    beforeEach(() => {
        vi.clearAllMocks();
        mapJobRoleToResponseMock.mockReset();
        jobRoleService = new JobRoleService();
    });

    it("should return all seeded job roles", async () => {
        vi.mocked(prisma).jobRole.findMany = vi.fn().mockResolvedValue(mockJobRoles);
        mapJobRoleToResponseMock
            .mockResolvedValueOnce(mockJobRoleResponses[0])
            .mockResolvedValueOnce(mockJobRoleResponses[1]);

        const result = await jobRoleService.findAllJobRoles();

        expect(result).toEqual(mockJobRoleResponses);
        expect(mapJobRoleToResponseMock).toHaveBeenCalledTimes(mockJobRoles.length);
    });
});
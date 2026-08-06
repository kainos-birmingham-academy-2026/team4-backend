import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { app } from "../../src/app";
import { JobRoleService } from "../../src/services/jobRoleService";
import { JobRoleController } from "../../src/controllers/jobRoleController";

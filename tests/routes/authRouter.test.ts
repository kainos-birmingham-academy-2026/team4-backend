import { describe, it, expect, vi, beforeEach } from 'vitest';
import request from 'supertest';
import express from 'express';
import { AuthError, AuthService } from '../../src/services/authService';
import { createAuthRouter } from '../../src/routes/authRouter';

vi.mock('../../src/services/authService', async () => {
    const actual = await vi.importActual('../../src/services/authService');
    return {
        AuthError: actual.AuthError,
        AuthService: vi.fn(),
    };
});

const mockAuthService = new (vi.mocked(AuthService))();

const mockLogin = vi.fn();
const mockRegister = vi.fn();

const mockBody = {
    email: "test@example.com",
    password: "Password321!"
}

const testApp = express();
testApp.use(express.json());
testApp.use(express.urlencoded({ extended: true }));
testApp.use("/auth", createAuthRouter(mockAuthService));

describe("POST /auth/login", async () => {

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("should return a token with status 200 when login is successful", async () => {
        mockAuthService.login = mockLogin.mockResolvedValue("mockToken");

        const response = await request(testApp).post("/auth/login").send(mockBody);
        
        expect(response.status).toBe(200);
        expect(mockLogin).toHaveBeenCalledWith(mockBody);
        expect(response.body).toEqual({ token: "mockToken" });
        
    });

    it("should return status 401 when login fails due to invalid credentials", async () => {
        mockAuthService.login = mockLogin.mockRejectedValue(new AuthError(401, "Invalid email or password"));
        
        const response = await request(testApp).post("/auth/login").send(mockBody);

        expect(response.status).toBe(401);
        expect(mockLogin).toHaveBeenCalledWith(mockBody);
        expect(response.body).toEqual({ error: "Invalid email or password" });
    });

    it("should return status 500 when an unexpected error occurs", async () => {
        mockAuthService.login = mockLogin.mockRejectedValue(new Error("Internal server error"));

        const response = await request(testApp).post("/auth/login").send(mockBody);

        expect(response.status).toBe(500);
        expect(mockLogin).toHaveBeenCalledWith(mockBody);
        expect(response.body).toEqual({ error: "Internal server error" });
    });
});

describe("POST /auth/register", async () => {

    it("should return a token with status 201 when registration is successful", async () => {
        mockAuthService.register = mockRegister.mockResolvedValue("mockToken");

        const response = await request(testApp).post("/auth/register").send(mockBody);

        expect(response.status).toBe(201);
        expect(mockRegister).toHaveBeenCalledWith(mockBody);
        expect(response.body).toEqual({ token: "mockToken" });
    });

    it("should return status 400 when registration fails due to validation errors", async () => {
        mockAuthService.register = mockRegister.mockRejectedValue(new AuthError(400, "Validation error"));

        const response = await request(testApp).post("/auth/register").send(mockBody);
        
        expect(response.status).toBe(400);
        expect(mockRegister).toHaveBeenCalledWith(mockBody);
        expect(response.body).toEqual({ error: "Validation error" });
    });

    it("should return status 500 when an unexpected error occurs", async () => {
        mockAuthService.register = mockRegister.mockRejectedValue(new Error("Internal server error"));

        const response = await request(testApp).post("/auth/register").send(mockBody);

        expect(response.status).toBe(500);
        expect(mockRegister).toHaveBeenCalledWith(mockBody);
        expect(response.body).toEqual({ error: "Internal server error" });
    });


});
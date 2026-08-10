import { PrismaClient } from "@prisma/client";
import argon2 from "argon2";

const prisma = new PrismaClient();

async function main() {
    // Clear any existing data
    await prisma.jobRole.deleteMany();
    await prisma.capability.deleteMany();
    await prisma.band.deleteMany();

    
    const passwordHash = await argon2.hash("Password123!");

    // Seed capabilities and bands arrays
    const capabilities = [
        "Engineering",
        "Workday",
        "Operations",
        "Commercial & Financial Management",
        "Platforms",
        "Experience Design",
        "Business Development & Marketing",
        "Business Services Support",
        "Data & AI",
        "Product",
        "Organisational Strategy & Planning",
        "Cyber Security",
        "Delivery",
        "People"
    ];

    const bands = [
        "Apprentice",
        "Trainee",
        "Associate",
        "Senior Associate",
        "Consultant",
        "Manager",
        "Principal",
        "Leader"
    ];

    await prisma.user.upsert({
        where: { email: "test1@example.com"},
        update: {},
        create: {
            email: "test1@example.com",
            passwordHash
        }
    })

    await prisma.capability.createMany({
        data: capabilities.map((capabilityName) => ({ capabilityName })),
        skipDuplicates: true
    });

    await prisma.band.createMany({
        data: bands.map((bandName) => ({ bandName })),
        skipDuplicates: true
    });

    // Read back for IDs
    const capabilityRows = await prisma.capability.findMany();
    const bandRows = await prisma.band.findMany();

    const capabilityMap = Object.fromEntries(
        capabilityRows.map((capability) => [capability.capabilityName, capability.capabilityId])
    );

    const bandMap = Object.fromEntries(
        bandRows.map((band) => [band.bandName, band.bandId])
    );

    await prisma.jobRole.createMany({
        data: [
            {
                roleName: "Graduate Software Engineer",
                location: "Birmingham",
                capabilityId: capabilityMap.Engineering,
                bandId: bandMap.Trainee,
                closingDate: new Date("2026-10-22"),
                status: "Open"
            },
            {
                roleName: "Senior Test Engineer",
                location: "Belfast",
                capabilityId: capabilityMap.Engineering,
                bandId: bandMap["Senior Associate"],
                closingDate: new Date("2026-09-19"),
                status: "Open"
            },
            {
                roleName: "Associate Platform Engineer",
                location: "Derry/Londonderry",
                capabilityId: capabilityMap.Platforms,
                bandId: bandMap.Associate,
                closingDate: new Date("2026-10-13"),
                status: "Open"
            },
            {
                roleName: "Lead Data Engineer",
                location: "London",
                capabilityId: capabilityMap["Data & AI"],
                bandId: bandMap.Consultant,
                closingDate: new Date("2026-12-16"),
                status: "Open"
            }
        ],
        skipDuplicates: true
    });
}

main().finally(() => prisma.$disconnect());
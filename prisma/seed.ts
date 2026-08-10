import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    // Clear any existing data
    await prisma.jobRole.deleteMany();
    await prisma.capability.deleteMany();
    await prisma.band.deleteMany();

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

    const statuses = ["Open", "Closed"];

    await prisma.capability.createMany({
        data: capabilities.map((capabilityName) => ({ capabilityName })),
        skipDuplicates: true
    });

    await prisma.band.createMany({
        data: bands.map((bandName) => ({ bandName })),
        skipDuplicates: true
    });

    await prisma.status.createMany({
        data: statuses.map((statusName) => ({ statusName })),
        skipDuplicates: true
    });

    // Read back for IDs
    const capabilityRows = await prisma.capability.findMany();
    const bandRows = await prisma.band.findMany();
    const statusRows = await prisma.status.findMany();

    const capabilityMap = Object.fromEntries(
        capabilityRows.map((capability) => [capability.capabilityName, capability.capabilityId])
    );

    const bandMap = Object.fromEntries(
        bandRows.map((band) => [band.bandName, band.bandId])
    );

    const statusMap = Object.fromEntries(
        statusRows.map((status) => [status.statusName, status.statusId])
    );

    await prisma.jobRole.createMany({
        data: [
            {
                roleName: "Graduate Software Engineer",
                location: "Birmingham",
                capabilityId: capabilityMap.Engineering,
                bandId: bandMap.Trainee,
                closingDate: new Date("2026-10-22"),
                statusId: statusMap.Open,
                description: "Responsible for developing and maintaining software applications.",
                responsibilities: ["Write code", "Fix bugs", "Collaborate with team"],
                sharepointUrl: "https://example.com/graduate-software-engineer",
                numberOfOpenPositions: 5
            },
            {
                roleName: "Senior Test Engineer",
                location: "Belfast",
                capabilityId: capabilityMap.Engineering,
                bandId: bandMap["Senior Associate"],
                closingDate: new Date("2026-09-19"),
                statusId: statusMap.Open,
                description: "Responsible for leading test engineering efforts.",
                responsibilities: ["Design test plans", "Execute test cases", "Report defects"],
                sharepointUrl: "https://example.com/senior-test-engineer",
                numberOfOpenPositions: 2
            },
            {
                roleName: "Associate Platform Engineer",
                location: "Derry/Londonderry",
                capabilityId: capabilityMap.Platforms,
                bandId: bandMap.Associate,
                closingDate: new Date("2026-10-13"),
                statusId: statusMap.Open,
                description: "Responsible for supporting platform engineering tasks.",
                responsibilities: ["Maintain platforms", "Support platform upgrades", "Monitor platform performance"],
                sharepointUrl: "https://example.com/associate-platform-engineer",
                numberOfOpenPositions: 3
            },
            {
                roleName: "Lead Data Engineer",
                location: "London",
                capabilityId: capabilityMap["Data & AI"],
                bandId: bandMap.Consultant,
                closingDate: new Date("2026-12-16"),
                statusId: statusMap.Closed,
                description: "Responsible for leading data engineering initiatives.",
                responsibilities: ["Design data pipelines", "Implement data solutions", "Mentor junior engineers"],
                sharepointUrl: "https://example.com/lead-data-engineer",
                numberOfOpenPositions: 0
            }
        ],
        skipDuplicates: true
    });
}

main().finally(() => prisma.$disconnect());
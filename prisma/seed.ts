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
        "Leader",
        "Executive"
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
                description: "As a Graduate Software Engineer with Kainos, you will work on projects where you can make a real difference to people's lives - the lives of people you know. After taking part in our award-winning, seven-week Engineering Academy, you will then join one of our many project teams, to learn from our experienced developers, project managers and customer-facing staff. You'll have great support and mentoring, balanced with the experience of being given real, meaningful work to do, to help you truly develop both technically and professionally.",
                responsibilities: ["Write code", "Fix bugs", "Collaborate with team"],
                sharepointUrl: "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Trainee).pdf",
                numberOfOpenPositions: 5
            },
            {
                roleName: "Senior Test Engineer",
                location: "Belfast",
                capabilityId: capabilityMap.Engineering,
                bandId: bandMap["Senior Associate"],
                closingDate: new Date("2026-09-19"),
                statusId: statusMap.Open,
                description: "As a Senior Test Engineer (Senior Associate) in Kainos, you'll work within a multi-skilled agile team, developing and executing functional automated and manual tests to help the team deliver working application software that meets user needs. You'll do this whilst learning about new technologies and approaches, with talented colleagues who will help you learn, develop and grow.",
                responsibilities: ["Design test plans", "Execute test cases", "Report defects"],
                sharepointUrl: "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Senior%20Test%20Engineer%20(SA).pdf",
                numberOfOpenPositions: 2
            },
            {
                roleName: "Associate Platform Engineer",
                location: "Derry/Londonderry",
                capabilityId: capabilityMap.Platforms,
                bandId: bandMap.Associate,
                closingDate: new Date("2026-10-13"),
                statusId: statusMap.Open,
                description: "As Platform Engineer (Associate) in Kainos, you'll be responsible for automating, building and supporting modern digital service platforms using public cloud technology. You'll be continually learning about new technologies, approaches and industry best practices all whilst being mentored and coached by talented colleagues who will help you learn, develop and grow. Successful candidates will have a passion for technology and a thirst for learning.",
                responsibilities: ["Maintain platforms", "Support platform upgrades", "Monitor platform performance"],
                sharepointUrl: "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Platforms/Job%20profile%20-%20Platform%20Engineer%20(Associate).pdf",
                numberOfOpenPositions: 3
            },
            {
                roleName: "Lead Data Engineer",
                location: "London",
                capabilityId: capabilityMap["Data & AI"],
                bandId: bandMap.Consultant,
                closingDate: new Date("2026-12-16"),
                statusId: statusMap.Closed,
                description: "As a Lead Data Engineer (Consultant) at Kainos you will be responsible for designing and developing data processing and data persistence software components for solutions which handle data at scale. Working in agile teams, Lead Data Engineers providing strong development leadership for team members and take responsibility for the quality of the codebase as well as the match to user needs.",
                responsibilities: ["Design data pipelines", "Implement data solutions", "Mentor junior engineers"],
                sharepointUrl: "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Forms/AllItems.aspx?id=%2Fsites%2FCareer%2FJobProfiles%2FData%20and%20Artificial%20Intelligence%2FArchive%2FJob%20specification%20%2D%20Lead%20Data%20Engineer%20%28C%29%2Epdf&parent=%2Fsites%2FCareer%2FJobProfiles%2FData%20and%20Artificial%20Intelligence%2FArchive",
                numberOfOpenPositions: 0
            },
            {
                roleName: "Low Code Solution Architect",
                location: "Gdansk",
                capabilityId: capabilityMap.Engineering,
                bandId: bandMap.Manager,
                closingDate: new Date("2026-11-30"),
                statusId: statusMap.Open,
                description: "As a Low Code Solution Architect (Manager) in Kainos, you'll be responsible for managing multi-skilled delivery teams to design and deliver high Low Code solutions which delight our customers and impact the lives of users worldwide. You'll work with customer architects to agree functional and non-functional designs, advising customers and managers on the estimated effort, technical implications and complexity surrounding your designs. You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction for your team as you solve challenging problems together. You will work with your peers to develop policy and standards, share knowledge and mentor those around you. You'll do this whilst advising about new technologies and approaches, with room to learn, develop and grow.",
                responsibilities: ["Design low code solutions", "Implement low code solutions", "Mentor junior engineers"],
                sharepointUrl: "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Low%20Code%20Solution%20Architect%20(M)%20.pdf",
                numberOfOpenPositions: 5
            },
            {
                roleName: "Talent Acquisition Partner",
                location: "Belfast",
                capabilityId: capabilityMap.People,
                bandId: bandMap["Senior Associate"],
                closingDate: new Date("2026-10-15"),
                statusId: statusMap.Open,
                description: "The Talent Acquisition team at Kainos are responsible for end to end delivery aligned to BU hiring demands. Based in locations across UK &I, Europe and North America, the team focus on direct sourcing channels to create a best in class candidate experience, in the most cost-effective way. As a Talent Acquisition Partner (Senior Associate), you will work closely with team members to manage the attraction and acquisition of high calibre talent. Providing best in class candidate experience and acting as a brand ambassador for recruitment at Kainos internally and externally.",
                responsibilities: ["Source candidates", "Conduct interviews", "Manage recruitment process"],
                sharepointUrl: "https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/People/Talent%20Acquisition/Job%20Profile%20-%20Talent%20Acquisition%20Partner%20(SA).pdf",
                numberOfOpenPositions: 2
            }
        ],
        skipDuplicates: true
    });
}

main().finally(() => prisma.$disconnect());
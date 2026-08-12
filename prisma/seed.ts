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
		"People",
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
		"Executive",
	];

	const statuses = ["Open", "Closed"];

	await prisma.user.upsert({
		where: { email: "test1@example.com" },
		update: {},
		create: {
			email: "test1@example.com",
			passwordHash,
		},
	});

	await prisma.capability.createMany({
		data: capabilities.map((capabilityName) => ({ capabilityName })),
		skipDuplicates: true,
	});

	await prisma.band.createMany({
		data: bands.map((bandName) => ({ bandName })),
		skipDuplicates: true,
	});

	await prisma.status.createMany({
		data: statuses.map((statusName) => ({ statusName })),
		skipDuplicates: true,
	});

	// Read back for IDs
	const capabilityRows = await prisma.capability.findMany();
	const bandRows = await prisma.band.findMany();
	const statusRows = await prisma.status.findMany();

	const capabilityMap = Object.fromEntries(
		capabilityRows.map((capability) => [
			capability.capabilityName,
			capability.capabilityId,
		]),
	);

	const bandMap = Object.fromEntries(
		bandRows.map((band) => [band.bandName, band.bandId]),
	);

	const statusMap = Object.fromEntries(
		statusRows.map((status) => [status.statusName, status.statusId]),
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
				description:
					"As a Graduate Software Engineer with Kainos, you will work on projects where you can make a real difference to people's lives - the lives of people you know. After taking part in our award-winning, seven-week Engineering Academy, you will then join one of our many project teams, to learn from our experienced developers, project managers and customer-facing staff. You'll have great support and mentoring, balanced with the experience of being given real, meaningful work to do, to help you truly develop both technically and professionally.",
				responsibilities: [
					"Contribute to developing high quality solutions which impact the lives of users worldwide.",
					"You'll work as part of a team to solve problems and produce innovative software solutions.",
					"Learn about new technologies and approaches, with talented colleagues who will help you learn, develop and grow.",
					"Based in our Kainos office and often on our customer sites, you will work on project teams to learn how to develop and unit test straightforward or low complexity components, and then moving on to more complex elements as you increase your knowledge.",
					"Work with other developers in working through designs and user stories and to produce real development solutions.",
					"Will be fully supported by experienced colleagues in the team to follow designs, and then progress to assist in any other aspect of the project life-cycle under supervision.",
					"Develop excellent technical, team-working and Agile project experience.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Software%20Engineer%20(Trainee).pdf",
				numberOfOpenPositions: 5,
			},
			{
				roleName: "Senior Test Engineer",
				location: "Belfast",
				capabilityId: capabilityMap.Engineering,
				bandId: bandMap["Senior Associate"],
				closingDate: new Date("2026-09-19"),
				statusId: statusMap.Open,
				description:
					"As a Senior Test Engineer (Senior Associate) in Kainos, you'll work within a multi-skilled agile team, developing and executing functional automated and manual tests to help the team deliver working application software that meets user needs. You'll do this whilst learning about new technologies and approaches, with talented colleagues who will help you learn, develop and grow.",
				responsibilities: [
					"Design test plans and test cases to ensure that the software meets the requirements and is of high quality.",
					"Execute functional automated and manual tests to help the team deliver working application software that meets user needs.",
					"Report defects and work with the team to resolve them.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Senior%20Test%20Engineer%20(SA).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Associate Platform Engineer",
				location: "Derry/Londonderry",
				capabilityId: capabilityMap.Platforms,
				bandId: bandMap.Associate,
				closingDate: new Date("2026-10-13"),
				statusId: statusMap.Open,
				description:
					"As Platform Engineer (Associate) in Kainos, you'll be responsible for automating, building and supporting modern digital service platforms using public cloud technology. You'll be continually learning about new technologies, approaches and industry best practices all whilst being mentored and coached by talented colleagues who will help you learn, develop and grow. Successful candidates will have a passion for technology and a thirst for learning.",
				responsibilities: [
					"Working as part of a team - You'll work alongside colleagues in engineering, testing, consulting, product management and security capabilities to build, test and deploy software of the highest quality.",
					"Using technology for positive impact - You'll ensure the latest technologies are employed appropriately to extract maximum user and business benefit.",
					"Putting people first - you'll support your colleagues and foster a DevOps culture in all that you do.",
					"Finding your voice - As a respected voice within the team you'll ensure that services are scalable, secure, reliable and performant.",
					"Supporting services through Live Operation - Getting services into production is just the beginning with the fun truly starting when real users start interacting with the service you've built. You'll make sure the service is available, secure and performant as you strive to continuously improve it.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Platforms/Job%20profile%20-%20Platform%20Engineer%20(Associate).pdf",
				numberOfOpenPositions: 3,
			},
			{
				roleName: "Lead Data Engineer",
				location: "London",
				capabilityId: capabilityMap["Data & AI"],
				bandId: bandMap.Consultant,
				closingDate: new Date("2026-12-16"),
				statusId: statusMap.Closed,
				description:
					"As a Lead Data Engineer (Consultant) at Kainos you will be responsible for designing and developing data processing and data persistence software components for solutions which handle data at scale. Working in agile teams, Lead Data Engineers providing strong development leadership for team members and take responsibility for the quality of the codebase as well as the match to user needs.",
				responsibilities: [
					"Taking responsibility for the development of whole components or subsystems within a team. Development incorporates design, code, test and defect resolution.",
					"Focusing on hands-on design and development, using open source and commercial platforms.",
					"Defining and enforcing development best practice and coaching junior team members to ensure consistency.",
					"Working with project architects, taking responsibility for non-functional needs of ETL/ELT data processing pipelines such as robustness and performance.",
					"Taking responsibility for standards and execution of unit and integration testing done within the team.",
					"Taking responsibility for software product due diligence and integration.",
					"Leading troubleshooting and tuning of activities.",
					"Working with Operations teams to ensure the application software is operationally ready.",
					"Working with Security Architects and accreditors to ensure compliance with relevant legal and security requirements.",
					"Advising customers and managers and other team members of the estimated effort and technical implications of user stories and user journeys.",
					"Contributing to technical proposals as part of the sales process.",
					"Managing, coaching and developing a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction and leadership for your team as you solve challenging problems together.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Forms/AllItems.aspx?id=%2Fsites%2FCareer%2FJobProfiles%2FData%20and%20Artificial%20Intelligence%2FArchive%2FJob%20specification%20%2D%20Lead%20Data%20Engineer%20%28C%29%2Epdf&parent=%2Fsites%2FCareer%2FJobProfiles%2FData%20and%20Artificial%20Intelligence%2FArchive",
				numberOfOpenPositions: 0,
			},
			{
				roleName: "Low Code Solution Architect",
				location: "Gdansk",
				capabilityId: capabilityMap.Engineering,
				bandId: bandMap.Manager,
				closingDate: new Date("2026-11-30"),
				statusId: statusMap.Open,
				description:
					"As a Low Code Solution Architect (Manager) in Kainos, you'll be responsible for managing multi-skilled delivery teams to design and deliver high Low Code solutions which delight our customers and impact the lives of users worldwide. You'll work with customer architects to agree functional and non-functional designs, advising customers and managers on the estimated effort, technical implications and complexity surrounding your designs. You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction for your team as you solve challenging problems together. You will work with your peers to develop policy and standards, share knowledge and mentor those around you. You'll do this whilst advising about new technologies and approaches, with room to learn, develop and grow.",
				responsibilities: [
					"You'll design and deliver low code solutions.",
					"You'll work with customers to agree functional and non-functional designs.",
					"You will mentor a small number of staff, with a focus on managing employee performance and assisting in their career development.",
					"You'll work with your peers to develop policy and standards, share knowledge and mentor those around you.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Low%20Code%20Solution%20Architect%20(M)%20.pdf",
				numberOfOpenPositions: 5,
			},
			{
				roleName: "Talent Acquisition Partner",
				location: "Belfast",
				capabilityId: capabilityMap.People,
				bandId: bandMap["Senior Associate"],
				closingDate: new Date("2026-10-15"),
				statusId: statusMap.Open,
				description:
					"The Talent Acquisition team at Kainos are responsible for end to end delivery aligned to BU hiring demands. Based in locations across UK &I, Europe and North America, the team focus on direct sourcing channels to create a best in class candidate experience, in the most cost-effective way. As a Talent Acquisition Partner (Senior Associate), you will work closely with team members to manage the attraction and acquisition of high calibre talent. Providing best in class candidate experience and acting as a brand ambassador for recruitment at Kainos internally and externally.",
				responsibilities: [
					"Delivering against recruitment delivery plans - you will support the recruitment delivery plan aligned to commercial priorities and workforce plans, for BU globally. This includes include understanding delivery demands against each location aligned to the Capabilities you support. Working with your Lead, your team and your BU stakeholders you will understand how to execute these hiring strategies for Permanent and Contract roles.",
					"Ensuring best in class execution - you will strive to deliver a best in class candidate experience for candidates at Kainos, in line with global process, Kainos values and our governance framework.",
					"Managing costs - you will ensure delivery is on time and in the most cost-effective manner. You will manage recruitment through a 'direct first' approach and if required, manage pipelines through supplier relationships in a timely manner.",
					"Reporting, Management Information (MI) and analytics - you will use MI and reporting to have data driven discussions with key stakeholders and ensure the recruitment process is managed in line with key SLA's. You will identify any blockers or escalations around scheduling are visible and escalated to avoid impact on time to hire.",
					"Driving brand awareness strategies to impact talent pipeline - in line with overall delivery demand, you will plan brand awareness strategies to leverage Talent Attraction and ensure talent pooling and candidate engagement/CRM are consistently being employed in the right way. Acting as a brand ambassador and role model for Kainos recruitment both internally and externally. You will have an active personal brand profile on social channels and be a regular contributor of best practice techniques and knowledge sharing.",
					"Tooling - using in house tooling and ATS platforms you will also keep abreast of innovations in tooling across the market. You will continuously improve your knowledge of key tooling techniques such as LinkedIn, bullion searching etc to ensure you are accessing the widest pools of talent available, in the quickest time.",
					"Working as a team - you will actively participate in team wide knowledge sharing of best practice and sharing market intel around market trends and talent with colleagues and stakeholders. You will help support on team wide projects and wider People projects as required. You will be the trusted strategic advisor for Talent Acquisition to your aligned capabilities.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/People/Talent%20Acquisition/Job%20Profile%20-%20Talent%20Acquisition%20Partner%20(SA).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Associate Product Consultant",
				location: "Birmingham",
				capabilityId: capabilityMap.Product,
				bandId: bandMap.Associate,
				closingDate: new Date("2026-10-20"),
				statusId: statusMap.Open,
				description:
					"As a Product Consultant (Associate) in Kainos, you will help contribute to the discovery and development of user and business needs liaising with your team to refine and develop these into user stories. You will be expected to understand how the backlog aligns to the roadmap and apply prioritisation techniques. You will manage these user stories within the product backlog, and work with the product owner and development team to see them through to completion. You will be responsible for articulating problems and processes in ways understood by all stakeholders - both business and technical, and for facilitating the analysis and design of cost-effective software solutions. You should actively participate and co-operate within the team, giving consideration to the communication needs of team members and clients. You get involved at meetings with clients, ask questions, listen and give honest information when appropriate.",
				responsibilities: [
					"Contribute to the discovery and development of user and business needs.",
					"Refine and develop user stories.",
					"Manage user stories within the product backlog.",
					"Work with the product owner and development team to see user stories through to completion.",
					"Articulate problems and processes in ways understood by all stakeholders - both business and technical.",
					"Facilitate the analysis and design of cost-effective software solutions.",
					"Actively participate and co-operate within the team, giving consideration to the communication needs of team members and clients.",
					"Get involved at meetings with clients, ask questions, listen and give honest information when appropriate.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Product/Job%20Profile%20-%20Product%20Consultant%20(Associate).pdf",
				numberOfOpenPositions: 4,
			},
			{
				roleName: "Graduate User Researcher",
				location: "London",
				capabilityId: capabilityMap["Experience Design"],
				bandId: bandMap.Trainee,
				closingDate: new Date("2026-10-22"),
				statusId: statusMap.Open,
				description:
					"As a User Researcher, you will deliver actionable insights that help define the right service experiences and focus them on user needs. You will be passionate about design research and an advocate for user needs-based design, design thinking and service design. You will be part of and supported by our growing Experience Design capability creating exemplary digital services. We are supportive, collaborative, talented, and hugely passionate about user-centred design. We are not about marketing and dark patterns; we are all about making a positive, measurable impact on millions of people through quality products and services.",
				responsibilities: [
					"Contribute to the discovery and development of user and business needs.",
					"Refine and develop user stories.",
					"Manage user stories within the product backlog.",
					"Work with the product owner and development team to see user stories through to completion.",
					"Articulate problems and processes in ways understood by all stakeholders - both business and technical.",
					"Facilitate the analysis and design of cost-effective software solutions.",
					"Actively participate and co-operate within the team, giving consideration to the communication needs of team members and clients.",
					"Get involved at meetings with clients, ask questions, listen and give honest information when appropriate.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Product/Job%20Profile%20-%20Product%20Consultant%20(Associate).pdf",
				numberOfOpenPositions: 7,
			},
			{
				roleName: "Placement Programme Office Assistant",
				location: "Belfast",
				capabilityId: capabilityMap.Operations,
				bandId: bandMap.Trainee,
				closingDate: new Date("2026-11-19"),
				statusId: statusMap.Open,
				description:
					"As a Programme Office Assistant (Trainee) at Kainos, you'll be responsible for ensuring that a high-quality service is provided to the Project Management and Operations capabilities within the Digital Services/Workday/Central Services business unit, demonstrating best practice throughout. You will provide administrative support for our engagements and will have a key role in the efficient management and delivery of these projects. You'll work as part of the Digital Services/Workday/Central Services Operations PMO team and report into the Operations Manager. It's a fast-paced environment so it is important for you to ensure that workload is prioritised, and tasks completed in a timely manner.",
				responsibilities: [
					"Setting up projects and carrying out the ongoing administration and maintenance within systems.",
					"Assisting with revenue and cost recognition.",
					"Assisting with managing project financials and reporting.",
					"Being responsible for Timesheet and Expense claim approvals.",
					"Assisting with month end invoicing.",
					"Managing and resolving of PMO support requests.",
					"Completing weekly timesheet (project specific).",
					"Taking on other ad-hoc administration duties.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Delivery/Job%20Profile%20-%20Programme%20Office%20Assistant%20(T).pdf",
				numberOfOpenPositions: 3,
			},
			{
				roleName: "Business Support Consultant",
				location: "Derry/Londonderry",
				capabilityId: capabilityMap["Business Services Support"],
				bandId: bandMap.Consultant,
				closingDate: new Date("2026-12-07"),
				statusId: statusMap.Open,
				description:
					"As a Business Support Consultant in Kainos, you will be responsible for leading delivery of high-quality administrative services and processes that support the core business at Kainos. You will be accountable for delivering improvements and motivating others in your team. You will be trusted to make tactical decisions and support the team to deliver best in class services to the core business while managing the delivery of small projects.",
				responsibilities: [
					"Lead delivery of high-quality administrative services and processes that support the core business at Kainos.",
					"Be accountable for delivering improvements and motivating others in your team.",
					"Be trusted to make tactical decisions and support the team to deliver best in class services to the core business while managing the delivery of small projects.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Business%20Services%20Support/Job%20profile%20-%20Business%20Support%20Consultant.pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Apprentice Software Engineer",
				location: "Belfast",
				capabilityId: capabilityMap.Engineering,
				bandId: bandMap.Apprentice,
				closingDate: new Date("2026-10-26"),
				statusId: statusMap.Open,
				description:
					"As an Apprentice Software Engineer with Kainos, you will work on projects where you can make a real difference to people's lives - the lives of people you know. extensive training to set you off on the right foot, you will quickly work as a part of a team in developing solutions within our real projects, learning all about our development languages, projects and technologies. You will be fully supported by experienced colleagues in the team as well as an experienced mentor, who will provide training and mentoring throughout your studies. You'll also get experience across a wide range of teams and projects, with built-in rotations to help you learn and work out which element of Software Engineering suits your interests and skills best. You'll have a genuine enthusiasm for anything “tech” and be able to really show this, both within and outside of your studies. You'll be able to show us your teamworking skills - everyone in Kainos works in tight-knit teams, so this is crucial. Our developers are creative - you'll be able to show us your skills for coming up with new ideas and ways of doing things, how you've solved problems and looked at things differently.",
				responsibilities: [
					"Contribute to developing high quality solutions which impact the lives of users worldwide.",
					"You'll work as part of a team to solve problems and produce innovative software solutions.",
					"Learn about new technologies and approaches, with talented colleagues who will help you learn, develop and grow.",
					"Based in our Kainos office and often on our customer sites, you will work on project teams to learn how to develop and unit test straightforward or low complexity components, and then moving on to more complex elements as you increase your knowledge.",
					"Work with other developers in working through designs and user stories and to produce real development solutions.",
					"Will be fully supported by experienced colleagues in the team to follow designs, and then progress to assist in any other aspect of the project life-cycle under supervision.",
					"Develop excellent technical, team-working and Agile project experience.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20-%20Apprentice%20Software%20Engineer%20(Apprentice).pdf",
				numberOfOpenPositions: 8,
			},
			{
				roleName: "Graduate Workday Data Consultant",
				location: "London",
				capabilityId: capabilityMap.Workday,
				bandId: bandMap.Trainee,
				closingDate: new Date("2026-12-15"),
				statusId: statusMap.Open,
				description:
					"As a Workday Data Consultant (Trainee) in Kainos, you will be responsible for supporting the successful specification, design and configuration of enterprise-scale Workday product solutions. This will be done by working with internal delivery teams to provide solutions that are fit for purpose and commercially viable. Understanding and translating customer requirements, as well as hands-on product configuration is essential for this role.",
				responsibilities: [
					"Support the successful specification, design and configuration of enterprise-scale Workday product solutions.",
					"Work with internal delivery teams to provide solutions that are fit for purpose and commercially viable.",
					"Understand and translate customer requirements, as well as hands-on product configuration.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Workday/Data/Job%20profile%20-%20Workday%20Data%20Consultant%20(Trainee).pdf",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Graduate Test Engineer",
				location: "Birmingham",
				capabilityId: capabilityMap.Engineering,
				bandId: bandMap.Trainee,
				closingDate: new Date("2026-10-22"),
				statusId: statusMap.Open,
				description:
					"As a Test Engineer (Trainee) in Kainos, you'll work within a multi-skilled agile team, developing and executing functional automated and manual tests to help the team deliver working application software that meets user needs. You'll do this whilst learning about new technologies and approaches, with talented colleagues who will help you learn, develop and grow.",
				responsibilities: [
					"Design test plans and test cases to ensure that the software meets the requirements and is of high quality.",
					"Execute functional automated and manual tests to help the team deliver working application software that meets user needs.",
					"Report defects and work with the team to resolve them.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Engineering/Job%20profile%20Trainee%20Test%20Engineer%20(Trainee).pdf",
				numberOfOpenPositions: 3,
			},
			{
				roleName: "Graduate Security Engineer",
				location: "Dublin",
				capabilityId: capabilityMap["Cyber Security"],
				bandId: bandMap.Trainee,
				closingDate: new Date("2026-12-20"),
				statusId: statusMap.Open,
				description:
					"As a Trainee Security Engineer, you will work in close collaboration with our technology teams to design and implement secure, cloud-based software solutions for our clients. Working as part of a multi-disciplinary Agile team, you will implement DevSecOps practices throughout the software development lifecycle, embedding security practices (e.g. vulnerability management, threat modelling etc.) and automating security artifact generation (e.g. secret scanning, container security, SAST, DAST etc.). You will provide subject matter expertise in application security or cloud security – sharing knowledge on threats and vulnerabilities, identifying appropriate security controls, and increasing cyber security awareness within teams.",
				responsibilities: [
					"Daily collaboration with the application development and cloud platform teams to plan and prioritise security requirements as part of the secure software development lifecycle (SSDLC).",
					"Implementation of automated security tooling (e.g. within a Continuous Integration (CI) pipeline) to validate security requirements and identify potential issues.",
					"Reviewing the outputs from security tools and security practices. You will filter and prioritise these into security stories that can be understood and actioned by the delivery teams.",
					"Verifying the implementation of security principles, architectural patterns, and requirements.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-04",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Associate Data Analyst",
				location: "Belfast",
				capabilityId: capabilityMap["Data & AI"],
				bandId: bandMap.Associate,
				closingDate: new Date("2026-12-22"),
				statusId: statusMap.Open,
				description:
					"As a Data Analyst (Associate) in Kainos, you'll be responsible for matching the needs of data insight with understanding of the available data. Data analysts work closely with customers to produce insight products including reports, dashboards and visualisations but also contribute to project understanding of existing data structures so that inputs and outputs are fully understood. Most of our work comes through repeat business and direct referrals, which comes down to the quality of our people. The success of our Data Engineering teams means that customers are bringing us an increasing number of exciting data projects using cuttingedge technology to solve real-world problems. We are seeking more high calibre people to join our Data & Analytics capability where you will grow and contribute to industryleading technical expertise.",
				responsibilities: [
					"Work with customers to produce insight products including reports, dashboards and visualisations.",
					"Contribute to project understanding of existing data structures so that inputs and outputs are fully understood.",
					"Match the needs of data insight with understanding of the available data.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Data%20and%20Artificial%20Intelligence/Job%20profile%20-%20Data%20Analyst%20(As).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Pagination Seed Role 06 - Platform Reliability Engineer",
				location: "Gdansk",
				capabilityId: capabilityMap.Platforms,
				bandId: bandMap.Consultant,
				closingDate: new Date("2026-12-23"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Improve service reliability through observability and automation.",
					"Respond to incidents and drive preventive improvements.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-06",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Pagination Seed Role 07 - UX Designer",
				location: "London",
				capabilityId: capabilityMap["Experience Design"],
				bandId: bandMap["Senior Associate"],
				closingDate: new Date("2026-12-24"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Create interface concepts and test with users.",
					"Translate research insights into design decisions.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-07",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Pagination Seed Role 08 - Business Operations Coordinator",
				location: "Birmingham",
				capabilityId: capabilityMap.Operations,
				bandId: bandMap.Associate,
				closingDate: new Date("2026-12-26"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Coordinate operational tasks across multiple teams.",
					"Maintain process documentation and status reporting.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-08",
				numberOfOpenPositions: 3,
			},
			{
				roleName: "Pagination Seed Role 09 - Commercial Analyst",
				location: "Derry/Londonderry",
				capabilityId: capabilityMap["Commercial & Financial Management"],
				bandId: bandMap.Associate,
				closingDate: new Date("2026-12-27"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Support forecasting, budgeting and cost analysis.",
					"Prepare commercial reports for stakeholders.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-09",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Pagination Seed Role 10 - People Advisor",
				location: "Belfast",
				capabilityId: capabilityMap.People,
				bandId: bandMap.Consultant,
				closingDate: new Date("2026-12-28"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Advise managers on people policies and practices.",
					"Support performance and development initiatives.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-10",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Pagination Seed Role 11 - Workday Functional Consultant",
				location: "Dublin",
				capabilityId: capabilityMap.Workday,
				bandId: bandMap.Consultant,
				closingDate: new Date("2026-12-29"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Configure and optimize Workday solutions for clients.",
					"Gather requirements and document functional designs.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-11",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Pagination Seed Role 12 - Strategy Associate",
				location: "London",
				capabilityId: capabilityMap["Organisational Strategy & Planning"],
				bandId: bandMap.Associate,
				closingDate: new Date("2026-12-30"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Support strategic planning and initiative tracking.",
					"Develop insights and recommendations for leadership.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-12",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Pagination Seed Role 13 - Marketing Executive",
				location: "Birmingham",
				capabilityId: capabilityMap["Business Development & Marketing"],
				bandId: bandMap.Associate,
				closingDate: new Date("2027-01-03"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Support campaign planning and execution.",
					"Track engagement metrics and report outcomes.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-13",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Pagination Seed Role 14 - Support Services Coordinator",
				location: "Gdansk",
				capabilityId: capabilityMap["Business Services Support"],
				bandId: bandMap["Senior Associate"],
				closingDate: new Date("2027-01-04"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Coordinate shared services operations and escalations.",
					"Improve process efficiency across support functions.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-14",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Pagination Seed Role 15 - Junior Test Engineer",
				location: "Belfast",
				capabilityId: capabilityMap.Engineering,
				bandId: bandMap.Trainee,
				closingDate: new Date("2027-01-05"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Execute test scenarios and report defects.",
					"Collaborate with developers to verify fixes.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-15",
				numberOfOpenPositions: 4,
			},
			{
				roleName: "Pagination Seed Role 16 - Principal Platform Architect",
				location: "London",
				capabilityId: capabilityMap.Platforms,
				bandId: bandMap.Principal,
				closingDate: new Date("2027-01-06"),
				statusId: statusMap.Closed,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Define platform architecture standards and roadmaps.",
					"Mentor teams on reliability and scalability practices.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-16",
				numberOfOpenPositions: 0,
			},
			{
				roleName: "Pagination Seed Role 17 - AI Engineer",
				location: "Dublin",
				capabilityId: capabilityMap["Data & AI"],
				bandId: bandMap.Consultant,
				closingDate: new Date("2027-01-07"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Develop AI features aligned to product goals.",
					"Evaluate model performance and data quality.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-17",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Pagination Seed Role 18 - Product Owner",
				location: "Birmingham",
				capabilityId: capabilityMap.Product,
				bandId: bandMap.Manager,
				closingDate: new Date("2027-01-08"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Own roadmap priorities and stakeholder alignment.",
					"Guide backlog outcomes with delivery teams.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-18",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Pagination Seed Role 19 - Programme Manager",
				location: "London",
				capabilityId: capabilityMap.Delivery,
				bandId: bandMap.Manager,
				closingDate: new Date("2027-01-09"),
				statusId: statusMap.Open,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Manage programme-level delivery plans and governance.",
					"Coordinate teams to deliver outcomes on schedule.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-19",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Pagination Seed Role 20 - Senior People Partner",
				location: "Belfast",
				capabilityId: capabilityMap.People,
				bandId: bandMap.Principal,
				closingDate: new Date("2027-01-10"),
				statusId: statusMap.Closed,
				description:
					"Seed role created to provide realistic volume for pagination and list view testing.",
				responsibilities: [
					"Lead strategic people initiatives across business units.",
					"Coach leaders on workforce planning and development.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-20",
				numberOfOpenPositions: 0,
			},
		],
		skipDuplicates: true,
	});
}

main().finally(() => prisma.$disconnect());

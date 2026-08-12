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
				roleName: "Senior Systems Support Engineer",
				location: "Gdansk",
				capabilityId: capabilityMap.Platforms,
				bandId: bandMap["Senior Associate"],
				closingDate: new Date("2026-12-23"),
				statusId: statusMap.Open,
				description:
					"As a Senior Systems Support Engineer (Senior Associate) at Kainos, you will be responsible for providing high quality, customer focused IT services and being a sole contributor to a specialist area of support. You will be continually learning whilst working with talented colleagues who will help you learn, develop and grow. As a senior member of the team you will also interact with customers, share knowledge and mentor those around you.",
				responsibilities: [
					"Owning first / second line IT customer support requests - you will be providing timely and accurate support to customers by responding to tickets which are logged via email, ticketing system or via customer phone calls, which will include but are not limited to the Apple and Microsoft Technology Stacks.",
					"Owning a specialism - you will be a sole contributor in a specialist support area and will be tasked with an overall team responsibility. You will be expected to autonomously oversee and own this task.",
					"Identifying improvements and savings - you will look for ways to contribute to improving the service. You will review the task and clearly identify/demonstrate either cost or time savings.",
					"Managing customers and other stakeholders - in your area of speciality you will be expected to navigate and own meetings with senior staff or external customers outside the teams. This will include running retrospectives and providing detailed analysis of problems. You will be expected to present back to internal customers or external customers a root cause analysis of issues, without supervision.",
					"Troubleshooting and presenting solutions - you will be expected to solve a range of technical issues, from basic to complex IT software/hardware issues and provide solutions where applicable. You will be expected to show clear step-by-step troubleshooting and problem solving of an issue. You will be expected to present proposals to senior team members on how best to resolve issues before escalating.",
					"Undertaking a range of routine and IT systems administrative tasks - you will be supported by colleagues to execute these tasks while you develop your skills and actively participating in knowledge sharing.",
					"Creating documentation - you will be documenting re-occurring issues and processes to build out the team's external and internal facing knowledge base.",
					"Working as part of a team & putting people first - you'll work as part of a team to deliver high quality support to the business and you will be expected to assist in fostering an open and inclusive System culture in all you do. You will be required to mentor and guide trainee and associate level engineers, helping them with understanding processes.",
					"Developing others - You'll manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You’ll also provide direction and leadership for your team as you solve challenging problems together. They are required to take on People management responsibilities and attend internal training to enable them to manage and interview.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Platforms/Job%20profile%20-%20Senior%20Systems%20Support%20Engineer%20(Senior%20Associate).pdf",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Senior UX Designer",
				location: "London",
				capabilityId: capabilityMap["Experience Design"],
				bandId: bandMap["Senior Associate"],
				closingDate: new Date("2026-12-24"),
				statusId: statusMap.Open,
				description:
					"As a UX Designer, you will deliver intuitive service experiences based on user needs and design principles. You will be passionate about needs-based design and an advocate for design thinking and service design. You will be part of and supported by our growing Experience Design capability creating exemplary digital services. We are supportive, collaborative, talented, and hugely passionate about user-centred design. We are not about marketing and dark patterns; we are all about making a positive, measurable impact on millions of people through quality products and services.",
				responsibilities: [
					"Deliver intuitive service experiences based on user needs and design principles.",
					"Be passionate about needs-based design and an advocate for design thinking and service design.",
					"Be part of and supported by our growing Experience Design capability creating exemplary digital services.",
					"Be supportive, collaborative, talented, and hugely passionate about user-centred design.",
					"Be all about making a positive, measurable impact on millions of people through quality products and services.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Experience%20Design/Job%20Specifcation%20-%20UX%20Designer%20(Senior%20Assoicate).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Associate Staffing Consultant",
				location: "Birmingham",
				capabilityId: capabilityMap.Operations,
				bandId: bandMap.Associate,
				closingDate: new Date("2026-12-26"),
				statusId: statusMap.Open,
				description:
					"As a Staffing Consultant (Associate) at Kainos, you will be responsible for the day-to-day staffing of projects within a Business unit. You will also be responsible for ensuring the accurate closure of month end accounts.",
				responsibilities: [
					"Reviewing multiple staffing requests and assign appropriate staff to projects on a timely basis.",
					"Supporting the management team to maintain the accuracy of staffing allocations in Kimble.",
					"Working with the recruitment team to ensure that recruitment interview and assessment days are properly staffed.",
					"Managing staff availability while minimising overall BU bench time.",
					"Working with the Training Manager and Learning & Development Team to ensure that training is scheduled at appropriate times.",
					"Liaising with the PMO team.",
					"Confirming staff allocations to projects, with awareness of the needs of both the project and the individual.",
					"Tracking staff utilisation and initiate corrective action with Project Managers where appropriate.",
					"Communicating changes in staff allocations to the appropriate individuals.",
					"Preparing timely relevant reports as required.",
					"Providing support to the Staffing + PMO Lead as required.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Operations/Job%20Profile%20-%20Staffing%20Consultant%20(Associate).pdf",
				numberOfOpenPositions: 3,
			},
			{
				roleName: "Finance Associate",
				location: "Derry/Londonderry",
				capabilityId: capabilityMap["Commercial & Financial Management"],
				bandId: bandMap.Associate,
				closingDate: new Date("2026-12-27"),
				statusId: statusMap.Open,
				description:
					"As a Finance Associate (Associate) at Kainos, you will be responsible for performing a wide variety of accounting tasks. You will be working as part of a Finance team within a fast-paced PLC environment to effectively deliver support for the core business.",
				responsibilities: [
					"Performing weekly reconciliations for various bank accounts in a variety of currencies.",
					"Updating weekly cashflow forecasts for Group bank accounts",
					"Reviewing employee expense submission in line with Kainos' expense policy.",
					"Assisting with the monthly payroll process.",
					"Assisting with credit control tasks as required.",
					"Assisting with the completion of all Group VAT reconciliations and returns.",
					"Preparing and submitting returns for external agencies such as Invest NI, Crown Commercial and NISRA.",
					"Assisting with month end tasks including accruals and prepayment calculations, balance sheet reconciliations and cost centre reviews.",
					"Liaising with other departments in Kainos (e.g. Facilities, Systems, People Support and Operations).",
					"Providing assistance to the Group Tax Manager as requested.",
					"Providing support to the rest of the Finance team including the Finance Manager(s) and Group Head of Finance as required.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Commercial%20and%20Financial%20Management/Financial%20Management/Job%20profile%20-%20Finance%20Associate%20(As).pdf",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Talent Acquisition Lead",
				location: "Belfast",
				capabilityId: capabilityMap.People,
				bandId: bandMap.Consultant,
				closingDate: new Date("2026-12-28"),
				statusId: statusMap.Open,
				description:
					"As a Talent Acquisition Lead (Consultant), you will work closely with team members to lead the attraction and acquisition of high calibre talent. Providing best in class candidate experience and acting as a brand ambassador for recruitment at Kainos internally and externally.",
				responsibilities: [
					"Delivering against recruitment delivery plans - you will implement the recruitment delivery plan aligned to commercial priorities and workforce plans, for BU globally. This includes having oversight of short, medium and long term delivery demands, across all locations and working with your BU stakeholders to execute hiring strategies for Permanent and Contract roles.",
					"Managing costs - you will ensure delivery is on time and in the most cost-effective manner. Managing the use of suppliers to ensure direct sourcing channels are optimised and that external agency costs are kept to a minimum. Managing supplier relationships and driving cost savings where possible with suppliers.",
					"Reporting, Management Information (MI) and analytics - you will use MI and reporting to have data driven discussions with key stakeholders and ensure the recruitment process is managed in line with key SLA's and that any blockers or escalations around scheduling are visible and escalated to avoid impact on time to hire.",
					"Driving brand awareness strategies to impact talent pipeline - in line with overall delivery demand, you will plan brand awareness strategies to leverage Talent Attraction and ensure talent pooling and candidate engagement/CRM are consistently being employed in the right way. Acting as a brand ambassador and role model for Kainos recruitment both internally and externally. You will have an active personal brand profile on social channels and be a regular contributor of best practice techniques and knowledge sharing.",
					"Driving continuous improvement - you will take an active lead in operational efficiency and always striving to improve the end to end process through process improvements. Actively engaging in Continuous improvement projects across the firm, working with other Kainos teams, as a Recruitment SME.",
					"Working as a team with a focus on developing coaching others - As a Lead, you will mentor and coach your recruitment team as well as Talent Acquisition Coordinators, proactively focusing on their career development and ensuring the right blend of skills and capabilities for current and future business requirements. You will be the trusted strategic advisor for Talent Acquisition to your aligned capabilities.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/People/Talent%20Acquisition/Job%20Profile%20-%20Talent%20Acquisition%20Lead%20(C).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Workday HCM Consultant",
				location: "Dublin",
				capabilityId: capabilityMap.Workday,
				bandId: bandMap.Consultant,
				closingDate: new Date("2026-12-29"),
				statusId: statusMap.Open,
				description:
					"As a Workday HCM Consultant (Consultant) in Kainos, you'll work in a team to implement and configure enterprise-scale Workday solutions for our global customer base, typically leading a project workstream. You will build relationships with our customers, shaping and delivering solutions that are aligned to customer needs, fit for purpose and commercially viable. You'll provide excellent guidance to customers, understanding their business and requirements. You'll support more junior members of the team and share your knowledge with them.",
				responsibilities: [
					"Implement and configure enterprise-scale Workday solutions for our global customer base, typically leading a project workstream.",
					"Build relationships with our customers, shaping and delivering solutions that are aligned to customer needs, fit for purpose and commercially viable.",
					"Provide excellent guidance to customers, understanding their business and requirements.",
					"Support more junior members of the team and share your knowledge with them.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Workday/HCM/Job%20profile%20-%20Workday%20HCM%20Consultant%20(Consultant).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Chief Revenue Officer",
				location: "London",
				capabilityId: capabilityMap["Organisational Strategy & Planning"],
				bandId: bandMap.Executive,
				closingDate: new Date("2026-12-30"),
				statusId: statusMap.Open,
				description:
					"The Workday Practice, Chief Revenue Officer plays a strategic role in supporting delivery of the business goals and strategic ambitions - to be a great employer, to delight our customers and to be a growing, profitable and responsible company. As an Executive in Kainos you will have an established track record in defining and implementing the sales strategy and processes for revenue growth for the Kainos Product Solutions across the entire business. As a member of the Executive Team, you will support all our sustainability programmes and take personal responsibility for one programme.",
				responsibilities: [
					"Sets the strategic direction and vision for revenue growth (£170m by FY2025) in the Kainos Workday Product Practice delivering a strategy in agreement with the Csuite and regularly reviewing against measurable objectives.",
					"Effectively communicates the Kainos Workday Products sales and growth strategy with Staff, Board and Shareholders.",
					"Investigates, understands and reacts to customer needs and the dynamics of each of the markets within which the various Regions operate; similarly understands economic and technology trends and implications for each of the Regions, growing our customer base from 300 to 1200 within 3 years.",
					"To establish strong executive relationships at the senior-most levels in customer organisations leading to a demonstrable track record of increasing sales and partnership value creation. Influencing, building rapport, and gaining credibility with both business and technology executives at leading Workday customers. Providing contextual knowledge of the SaaS software market in services products.",
					"Lead and manage pricing and all sales activities for the product solutions, defining the appropriate go-to-market strategy and executing against a plan to increase revenues and grow market share. This will include building an effective sales process, execution strategy, sales organisation and partner ecosystem around a “hybrid model” that includes standard products, custom software development and services.",
					"A thought leader, in terms of revenue-generating ideas and solutions, as well as effective planning and forecasting of sales results with a consistent record of achieving/exceeding plans.",
					"Supports the development of and adherence to Group People strategies to engage, develop, retain and attract the top talent in the market.",
					"Ensures adherence to Kainos company culture, modelling behaviours that exemplify the company values.",
					"Creates an environment that enables Product development teams to contribute and deliver the Workday Product Practice strategy.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Organisational%20Strategy%20and%20Planning/Job%20Profile%20-%20Chief%20Revenue%20Officer%20(E).pdf",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Marketing Associate",
				location: "Birmingham",
				capabilityId: capabilityMap["Business Development & Marketing"],
				bandId: bandMap.Associate,
				closingDate: new Date("2027-01-03"),
				statusId: statusMap.Open,
				description:
					"As a Marketing Associate at Kainos, you will support in creating and delivering the marketing campaigns and activities that are aligned to commercial needs and designed to drive brand awareness/support recruitment/generate leads to fuel the sales pipeline. This will include competitor research, supporting content creation and activation, digital and social media marketing, reporting and evaluation, and undertaking defined projects to support delivery against plan.",
				responsibilities: [
					"Assisting with development and management of strategy, plans and budgets - you will assist in research, creation and day-to-day delivery of marketing plans, ensuring delivery is on time and within budget. You will adhere to the budgeting process and keep the marketing budget for your allocated area or project up-to-date.",
					"Assisting in campaigns and content - working with marketing colleagues, sales and subject-matter experts across the business you will support the creation of campaigns and marketing content to drive brand awareness/support recruitment campaigns/generate leads to feed sales. You will assist in effective implementation of campaigns across a variety of channels to achieve objectives. This will be done by utilising a range of techniques including eDM, automation/nurtures, webinars, organic and paid social media, SEO/search, digital advertising and physical events.",
					"Contributing to reporting, accountability and ROI - you will actively contribute to marketing effectiveness and ROI reporting on campaigns and activities, supporting colleagues through evaluation, analysis and a transparent approach.",
					"Developing strategic alliances with Partners and agencies - supporting colleagues, you will develop or foster strong relationships with key Partners like Workday, Microsoft, and AWS, and liaise with external stakeholders and agencies.",
					"Working as part of a team - you will proactively work and collaborate as part of the marketing team to deliver against overall OKRs. Supporting and liaising with internal stakeholders of all levels across the business as needed.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Business%20Development%20and%20Marketing/Marketing%20-%20Business/Job%20profile%20-%20Marketing%20Associate%20(As).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Senior Business Services Support Associate",
				location: "Gdansk",
				capabilityId: capabilityMap["Business Services Support"],
				bandId: bandMap["Senior Associate"],
				closingDate: new Date("2027-01-04"),
				statusId: statusMap.Open,
				description:
					"As a Senior Business Support Associate in Kainos, you will be responsible for providing high quality administrative services and processes that support the core business at Kainos. You will be accountable for delivering high quality work with limited supervision. You will be trusted to make tactical decisions and support the team to deliver best in class services to the core business.",
				responsibilities: [
					"Provide high quality administrative services and processes that support the core business at Kainos.",
					"Be accountable for delivering high quality work with limited supervision.",
					"Be trusted to make tactical decisions and support the team to deliver best in class services to the core business.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Business%20Services%20Support/Job%20profile%20-%20Senior%20Business%20Support%20Associate.pdf",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Graduate Test Engineer",
				location: "Belfast",
				capabilityId: capabilityMap.Engineering,
				bandId: bandMap.Trainee,
				closingDate: new Date("2027-01-05"),
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
				numberOfOpenPositions: 4,
			},
			{
				roleName: "Principal Platform Architect",
				location: "London",
				capabilityId: capabilityMap.Platforms,
				bandId: bandMap.Principal,
				closingDate: new Date("2027-01-06"),
				statusId: statusMap.Closed,
				description:
					"As a Principal Platform Architect (Principal) for Kainos, you'll be accountable for leading the delivery of cloud platforms and solutions enabling business transformation which delight our customers and positively impact the lives of users worldwide. As a technologist you will be inquisitive and will embrace new technology. You will provide leadership as part of multi-disciplinary agile teams building a shared understanding of the outcomes the solution must deliver, the technical landscape and complexity surrounding you and your teams' designs to help teams make informed decisions. You'll foster and build relationships with senior stakeholders to establish architectural principles, strategic direction of platform being delivered including a firm understanding of functional and non-functional needs. You will play a leading role in the Kainos Platforms Capability, driving technology direction and advancement. You will also guide others in the capability to support their career journeys, you too will be supported on your career journey, enabling you to achieve your ambitions. As a technical leader, you will collaborate with colleagues to establish development of blueprints and standards, foster customer relationships, contribute to account strategies and actively share your subject matter knowledge, act as a technology ambassador for Kainos.",
				responsibilities: [
					"Lead the delivery of cloud platforms and solutions enabling business transformation which delight our customers and positively impact the lives of users worldwide.",
					"Provide leadership as part of multi-disciplinary agile teams building a shared understanding of the outcomes the solution must deliver, the technical landscape and complexity surrounding you and your teams' designs to help teams make informed decisions.",
					"Foster and build relationships with senior stakeholders to establish architectural principles, strategic direction of platform being delivered including a firm understanding of functional and non-functional needs.",
					"Play a leading role in the Kainos Platforms Capability, driving technology direction and advancement.",
					"Guide others in the capability to support their career journeys, you too will be supported on your career journey, enabling you to achieve your ambitions.",
					"Collaborate with colleagues to establish development of blueprints and standards, foster customer relationships, contribute to account strategies and actively share your subject matter knowledge, act as a technology ambassador for Kainos.",
				],
				sharepointUrl:
					"https://example.com/job-profiles/pagination-seed-role-16",
				numberOfOpenPositions: 0,
			},
			{
				roleName: "Lead AI Engineer",
				location: "Dublin",
				capabilityId: capabilityMap["Data & AI"],
				bandId: bandMap.Consultant,
				closingDate: new Date("2027-01-07"),
				statusId: statusMap.Open,
				description:
					"As a Lead Artificial Intelligence (AI) Engineer in Kainos, you'll be responsible for leading teams and developing high quality AI and ML solutions which delight our customers and impact the lives of users worldwide. It's a fast-paced environment so it is important for you to make sound, reasoned decisions. You'll do this whilst learning about new technologies and approaches, with talented colleagues that will help you to learn, develop and grow. As the technical leader in the team, you will also lead projects, interact with customers, share knowledge, provide thought leadership and mentor those around you. You will manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You'll also provide direction and leadership for your team as you solve challenging problems together.",
				responsibilities: [
					"Lead teams and develop high quality AI and ML solutions which delight our customers and impact the lives of users worldwide.",
					"Make sound, reasoned decisions in a fast-paced environment.",
					"Lead projects, interact with customers, share knowledge, provide thought leadership and mentor those around you.",
					"Manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development.",
					"Provide direction and leadership for your team as you solve challenging problems together.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Data%20and%20Artificial%20Intelligence/Job%20Profile%20-%20Lead%20AI%20Engineer%20(Consultant).pdf",
				numberOfOpenPositions: 2,
			},
			{
				roleName: "Product Consultant",
				location: "Birmingham",
				capabilityId: capabilityMap.Product,
				bandId: bandMap.Manager,
				closingDate: new Date("2027-01-08"),
				statusId: statusMap.Open,
				description:
					"As a Product Consultant (Manager) at Kainos, you will play a lead role across one or more multi-disciplinary agile delivery teams. You will own the end-to-end backlog for a product, responsible for its overall quality and maturity. You will lead the business analysts and product consultants on your project, ensuring that the processes for requirementsgathering and prioritisation are operating effectively. You will work with delivery managers and solution architects to shape the approach for the work you and the wider team undertakes. You proactively seek commercial opportunities and take a lead role in product-level commercial negotiations. You will actively support the engagement with product or programme-level business stakeholders, gaining their buy-in and managing their expectations. You will act as a visible leader within the consulting capability, owning the delivery of consulting initiatives. You'll also manage, coach and develop a small number of staff, with a focus on managing employee performance.",
				responsibilities: [
					"Play a lead role across one or more multi-disciplinary agile delivery teams, owning the end-to-end backlog for a product, responsible for its overall quality and maturity.",
					"Lead the business analysts and product consultants on your project, ensuring that the processes for requirements-gathering and prioritisation are operating effectively.",
					"Work with delivery managers and solution architects to shape the approach for the work you and the wider team undertakes.",
					"Proactively seek commercial opportunities and take a lead role in product-level commercial negotiations.",
					"Actively support the engagement with product or programme-level business stakeholders, gaining their buy-in and managing their expectations.",
					"Act as a visible leader within the consulting capability, owning the delivery of consulting initiatives.",
					"Manage, coach and develop a small number of staff, with a focus on managing employee performance.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Product/Job%20Profile%20-%20Product%20Consultant%20(Manager).pdf",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "Delivery Manager",
				location: "London",
				capabilityId: capabilityMap.Delivery,
				bandId: bandMap.Manager,
				closingDate: new Date("2027-01-09"),
				statusId: statusMap.Open,
				description:
					"As a Delivery Manager (Manager) at Kainos, you will be responsible for ensuring that Kainos' innovative digital services and platforms meet the user need and the outcomes agreed between Kainos and the client, whilst ensuring our delivery follows good governance and quality standards. You will empower and support Kainos teams to perform well, learn and grow in a manner that is consistent with Kainos company values. You will leverage successful delivery and strong client relationships to explore opportunities to win follow-on business with existing customers.",
				responsibilities: [
					"Ensure that Kainos' innovative digital services and platforms meet the user need and the outcomes agreed between Kainos and the client, whilst ensuring our delivery follows good governance and quality standards.",
					"Empower and support Kainos teams to perform well, learn and grow in a manner that is consistent with Kainos company values.",
					"Leverage successful delivery and strong client relationships to explore opportunities to win follow-on business with existing customers.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/Delivery/Job%20profile%20-%20Delivery%20Manager%20(Manager).pdf",
				numberOfOpenPositions: 1,
			},
			{
				roleName: "People Support Principal",
				location: "Belfast",
				capabilityId: capabilityMap.People,
				bandId: bandMap.Principal,
				closingDate: new Date("2027-01-10"),
				statusId: statusMap.Closed,
				description:
					"As a People Support Principal at Kainos, you will be a key member of the People Support Management team and provide strategic people direction across Kainos globally. This will include the design, delivery and improvement of key people initiatives both centrally and within the BU's to ensure they remain fit for the changing business needs of a growing organisation. You will deputise for the Global Head of People Support, may lead a team of colleagues or act in in a standalone role as an SME or People Partner to the BU.",
				responsibilities: [
					"Supporting the delivery of our People strategy - you will be responsible for specific projects and/or oversee project delivery by team members to ensure a measurable and significant impact to the wider business.",
					"Building and maintaining strong relationships - you will develop relationships with leaders and managers across our business to become a trusted advisor on all people matters. You will also develop networks external to Kainos that allow you to share learnings, act as an ambassador for the brand and remain up to date on any changes in legislation and/or best practice.",
					"Owning people policies - you will ensure policies (in each jurisdiction) are updated, commercially focused, user friendly and embedded within the business. You may also be responsible for leading on the implementation of any changes as appropriate.",
					"Managing Employee Relations issues - you will provide strategic advice and guidance to business leaders across multiple jurisdictions globally. You will also act as a point of escalation for any issues which may arise.",
					"Driving continuous improvement - you will create an environment in which you drive improvement within the People Support team to ensure best in class service delivery and cost reduction by maximising use of HRIS to ensure efficiencies.",
					"Delivering Management information - you will deliver accurate and timely MI that can be used to inform discussions across the business and anticipate future trends, driving people change initiatives in line with best practice, industry standards and the longer term growth of the business.",
					"Putting people first & developing others - you will manage, coach and develop a small number of staff, with a focus on managing employee performance and assisting in their career development. You will also be an active role model for the People Support function in the wider business.",
					"Ensuring legal compliance - you will ensure compliance on all employment matters in each jurisdiction, leading on, or acting as a point of escalation for any issues which may arise.",
				],
				sharepointUrl:
					"https://kainossoftwareltd.sharepoint.com/sites/Career/JobProfiles/People/People%20Support/Job%20profile%20-%20People%20Support%20Principal%20(Principal).pdf",
				numberOfOpenPositions: 0,
			},
		],
		skipDuplicates: true,
	});
}

main().finally(() => prisma.$disconnect());

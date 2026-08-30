const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'public', 'Achievements');

const TITLE_OVERRIDES = {
    'aws-academy-graduate-cloud-architecting-training-ba': 'AWS Academy Graduate - Cloud Architecting Training Badge',
    'aws-academy-graduate-cloud-data-pipeline-builder-tr': 'AWS Academy Graduate - Cloud Data Pipeline Builder Training Badge',
    'aws-academy-graduate-cloud-developing-training-badg': 'AWS Academy Graduate - Cloud Developing Training Badge',
    'aws-academy-graduate-cloud-foundations-training-bad': 'AWS Academy Graduate - Cloud Foundations Training Badge',
    'aws-academy-graduate-cloud-web-application-builder-': 'AWS Academy Graduate - Cloud Web Application Builder Training Badge',
    'aws-academy-graduate-generative-ai-foundations-trai': 'AWS Academy Graduate - Generative AI Foundations Training Badge',
    'aws-academy-graduate-machine-learning-for-natural-l': 'AWS Academy Graduate - Machine Learning for Natural Language Processing Training Badge',
    'aws-academy-graduate-machine-learning-foundations-t': 'AWS Academy Graduate - Machine Learning Foundations Training Badge',
    'aws-academy-graduate-microservices-and-ci-cd-pipeli': 'AWS Academy Graduate - Microservices and CI/CD Pipelines Training Badge',
    'aws-educate-introduction-to-cloud-101-training-badg': 'AWS Educate - Introduction to Cloud 101 Training Badge',
    'building-ai-powered-search-with-mongodb-vector-sear.1': 'Building AI-Powered Search with MongoDB Vector Search',
    'mongodb-schema-design-patterns-and-anti-patterns-skill': 'MongoDB Schema Design Patterns and Anti-Patterns Skill Badge',
    'from-relational-model-sql-to-mongodb-s-document-model': "From Relational Model (SQL) to MongoDB's Document Model",
    'mongodb-indexing-design-fundamentals': 'MongoDB Indexing Design Fundamentals',
    'mongodb-overview-core-concepts-and-architecture': 'MongoDB Overview - Core Concepts and Architecture',
    'crud-operations-in-mongodb': 'CRUD Operations in MongoDB',
    'building-rag-apps-using-mongodb': 'Building RAG Apps Using MongoDB',
    'python-essentials-1.1': 'Python Essentials 1 Badge',
    'Python_Essentials_1_Badge': 'Python Essentials 1 Badge',
    'Agentic_AI_Certified_Foundations_Associate_Badge': 'Agentic AI Certified Foundations Associate Badge',
    'Oracle_AIDP_Essentials_Badge': 'Oracle AIDP Essentials Badge',
    'Foundational_CSharp_with_Microsoft': 'Foundational C# with Microsoft'
};

function formatTitle(filename) {
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    if (TITLE_OVERRIDES[nameWithoutExt] || TITLE_OVERRIDES[filename]) {
        return TITLE_OVERRIDES[nameWithoutExt] || TITLE_OVERRIDES[filename];
    }

    const words = nameWithoutExt
        .replace(/_Badge$/i, '')
        .replace(/[~]+/g, ' ')
        .replace(/[_-]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .split(' ');

    return words
        .map((word, index) => {
            if (/^c#$/i.test(word) || /^csharp$/i.test(word)) {
                return 'C#';
            }
            if (/^(ai|al|ml|gfg|aws|ibm|hp|ets|gssoc|elusoc|nsoc|ecsoc|cisco|api|ui|ux|sql|aidp|jis|icdmai|sswc|acm|fdp|dfpd|upits|pm|rag|crud)$/i.test(word)) {
                return word.toLowerCase() === 'al' ? 'AI' : word.toUpperCase();
            }
            if (index > 0 && /^(with|and|of|in|for|on|the|at|to|a|an|by)$/i.test(word)) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join(' ');
}

function getValidFiles(dirPath, relativeDir) {
    if (!fs.existsSync(dirPath)) return [];
    const files = fs.readdirSync(dirPath).filter(f => {
        const full = path.join(dirPath, f);
        if (fs.statSync(full).isDirectory()) return false;
        const ext = path.extname(f).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.pdf', '.gif'].includes(ext);
    });

    // Natural numeric sort so 100 comes before 1000, and 1000 comes before 10000
    files.sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }));

    return files.map(f => ({
        title: formatTitle(f),
        file: `/Achievements/${relativeDir}/${f}`.replace(/\\/g, '/')
    }));
}

function buildAchievements() {
    const categoryMap = new Map();

    function addItems(catName, items) {
        if (!items || items.length === 0) return;
        if (!categoryMap.has(catName)) {
            categoryMap.set(catName, []);
        }
        categoryMap.get(catName).push(...items);
    }

    // 1. Awards & Recognitions
    addItems("Awards & Recognitions", getValidFiles(path.join(baseDir, 'Awards'), 'Awards'));

    // 2. Events & Hackathons
    addItems("Events & Hackathons", getValidFiles(path.join(baseDir, 'Events'), 'Events'));

    // 3. Agents League
    const agentsLeagueDir = path.join(baseDir, 'Agents League');
    if (fs.existsSync(agentsLeagueDir)) {
        addItems("Agents League Badges", getValidFiles(agentsLeagueDir, 'Agents League'));
    }

    // 4. Open Source Badges (Only OSP programs)
    const ospBadges = path.join(baseDir, 'Open Source Programs', 'Badges');
    if (fs.existsSync(ospBadges)) {
        addItems("GirlScript Summer of Code (GSSoC) Badges", getValidFiles(path.join(ospBadges, 'GSSoC_2026'), 'Open Source Programs/Badges/GSSoC_2026'));
        addItems("EduLinkUp Summer of Code (ELUSoC) Badges", getValidFiles(path.join(ospBadges, 'ELUSoC_2026'), 'Open Source Programs/Badges/ELUSoC_2026'));
        addItems("Nexus Spring of Code (NSoC) Badges", getValidFiles(path.join(ospBadges, 'NSoC_2026'), 'Open Source Programs/Badges/NSoC_2026'));
        addItems("Elite Coders Summer of Code (ECSoC) Badges", getValidFiles(path.join(ospBadges, 'ECSoC_2026'), 'Open Source Programs/Badges/ECSoC_2026'));
    }

    // 5. AWS
    addItems("AWS Badges", getValidFiles(path.join(baseDir, 'AWS', 'Badges'), 'AWS/Badges'));
    addItems("AWS", getValidFiles(path.join(baseDir, 'AWS', 'Certificates'), 'AWS/Certificates'));

    // 6. CISCO
    addItems("CISCO Badges", getValidFiles(path.join(baseDir, 'CISCO', 'Badges'), 'CISCO/Badges'));
    addItems("CISCO", getValidFiles(path.join(baseDir, 'CISCO', 'Certificates'), 'CISCO/Certificates'));

    // 7. Cognitive Class
    addItems("Cognitive Class", getValidFiles(path.join(baseDir, 'Cognitive Class'), 'Cognitive Class'));

    // 8. ETS
    addItems("ETS", getValidFiles(path.join(baseDir, 'ets'), 'ets'));

    // 9. FutureSkillsPrime
    addItems("FutureSkillsPrime", getValidFiles(path.join(baseDir, 'FutureSkillsPrime'), 'FutureSkillsPrime'));

    // 10. GeeksforGeeks / GFG
    addItems("GFG Badges", getValidFiles(path.join(baseDir, 'gfg', 'Badges'), 'gfg/Badges'));
    addItems("GeeksforGeeks", getValidFiles(path.join(baseDir, 'gfg', 'Certificates'), 'gfg/Certificates'));

    // 11. Google
    addItems("Google Badges", getValidFiles(path.join(baseDir, 'Google', 'Badges'), 'Google/Badges'));
    addItems("Google", getValidFiles(path.join(baseDir, 'Google', 'Certificates'), 'Google/Certificates'));

    // 12. GTech Learn
    addItems("GTech Learn", getValidFiles(path.join(baseDir, 'GTech Learn'), 'GTech Learn'));

    // 13. Hack2Skill
    addItems("Hack2Skill", getValidFiles(path.join(baseDir, 'Hack2Skill'), 'Hack2Skill'));

    // 14. HackerRank
    addItems("HackerRank", getValidFiles(path.join(baseDir, 'HackerRank'), 'HackerRank'));

    // 15. HCL Guvi
    addItems("HCL Guvi", getValidFiles(path.join(baseDir, 'HCL Guvi'), 'HCL Guvi'));

    // 16. Holopin Badges
    addItems("Holopin Badges", getValidFiles(path.join(baseDir, 'Holopin'), 'Holopin'));

    // 17. HP Life
    addItems("HP Life Badges", getValidFiles(path.join(baseDir, 'hp Life', 'Badges'), 'hp Life/Badges'));
    addItems("HP Life", getValidFiles(path.join(baseDir, 'hp Life'), 'hp Life'));

    // 18. IBM
    addItems("IBM Badges", getValidFiles(path.join(baseDir, 'IBM', 'Badges'), 'IBM/Badges'));
    addItems("IBM", getValidFiles(path.join(baseDir, 'IBM', 'Certificates'), 'IBM/Certificates'));

    // 19. IndiaAI Badges
    addItems("IndiaAI Badges", getValidFiles(path.join(baseDir, 'IndiaAI'), 'IndiaAI'));

    // 20. Infosys Springboard
    addItems("Infosys Springboard", getValidFiles(path.join(baseDir, 'Infosys Springboard'), 'Infosys Springboard'));

    // 21. Internship (Infosys Springboard, Oasis Infobyte & The Developers Arena)
    const internDir = path.join(baseDir, 'Internship');
    if (fs.existsSync(internDir)) {
        addItems("Infosys Springboard Internships", getValidFiles(path.join(internDir, 'Infosys Springboard'), 'Internship/Infosys Springboard'));
        addItems("Oasis Infobyte", getValidFiles(path.join(internDir, 'Oasis Infobyte'), 'Internship/Oasis Infobyte'));
        addItems("The Developers Arena", getValidFiles(path.join(internDir, 'The Developers Arena'), 'Internship/The Developers Arena'));
    }

    // 22. Kaggle
    addItems("Kaggle", getValidFiles(path.join(baseDir, 'Kaggle'), 'Kaggle'));

    // 23. LeetCode Badges
    addItems("LeetCode Badges", getValidFiles(path.join(baseDir, 'LeetCode'), 'LeetCode'));

    // 24. Let's Upgrade (LU)
    addItems("Let's Upgrade", getValidFiles(path.join(baseDir, 'LU'), 'LU'));

    // 25. Microsoft
    addItems("Microsoft Badges", getValidFiles(path.join(baseDir, 'Microsoft', 'Badges'), 'Microsoft/Badges'));
    addItems("Microsoft", getValidFiles(path.join(baseDir, 'Microsoft', 'Certificates'), 'Microsoft/Certificates'));
    addItems("Microsoft Certifications", getValidFiles(path.join(baseDir, 'Microsoft', 'Certifications'), 'Microsoft/Certifications'));

    // 26. MyBharat
    addItems("MyBharat", getValidFiles(path.join(baseDir, 'MyBharat'), 'MyBharat'));

    // 27. myGov
    addItems("myGov", getValidFiles(path.join(baseDir, 'myGov'), 'myGov'));

    // 28. Oracle
    addItems("Oracle Badges", getValidFiles(path.join(baseDir, 'Oracle', 'Badges'), 'Oracle/Badges'));
    addItems("Oracle", getValidFiles(path.join(baseDir, 'Oracle', 'Certificates'), 'Oracle/Certificates'));

    // 29. Pantech e Learning
    addItems("Pantech e Learning", getValidFiles(path.join(baseDir, 'Pantech e Learning'), 'Pantech e Learning'));

    // 30. Qualcomm
    addItems("Qualcomm Badges", getValidFiles(path.join(baseDir, 'Qualcomm', 'Badges'), 'Qualcomm/Badges'));
    addItems("Qualcomm", getValidFiles(path.join(baseDir, 'Qualcomm', 'Certificates'), 'Qualcomm/Certificates'));

    // 31. Saylor Academy
    addItems("Saylor Academy", getValidFiles(path.join(baseDir, 'Saylor Academy'), 'Saylor Academy'));

    // 32. Scaler
    addItems("Scaler", getValidFiles(path.join(baseDir, 'Scaler'), 'Scaler'));

    // 33. SimpliLearn
    addItems("SimpliLearn", getValidFiles(path.join(baseDir, 'SimpliLearn'), 'SimpliLearn'));

    // 34. Skill India
    addItems("Skill India", getValidFiles(path.join(baseDir, 'Skill India'), 'Skill India'));

    // 35. Skill Nation
    addItems("Skill Nation", getValidFiles(path.join(baseDir, 'Skill Nation'), 'Skill Nation'));

    // 36. Udemy
    addItems("Udemy", getValidFiles(path.join(baseDir, 'Udemy'), 'Udemy'));

    // 37. Unstop
    const unstopDir = path.join(baseDir, 'Unstop');
    if (fs.existsSync(unstopDir)) {
        addItems("Unstop Badges", getValidFiles(path.join(unstopDir, 'Badges'), 'Unstop/Badges'));
        addItems("Unstop", getValidFiles(path.join(unstopDir, 'Certificates'), 'Unstop/Certificates'));
        addItems("Unstop", getValidFiles(unstopDir, 'Unstop'));
    }

    const result = [];
    for (const [category, items] of categoryMap.entries()) {
        if (category !== "Awards & Recognitions" && category !== "Unstop Badges") {
            items.sort((a, b) => a.title.localeCompare(b.title, undefined, { sensitivity: 'base' }));
        }
        result.push({
            category,
            items
        });
    }

    return result;
}

const data = buildAchievements();
const tsContent = `interface AchievementItem {
    title: string;
    file: string;
}

interface AchievementCategory {
    category: string;
    items: AchievementItem[];
}

export const achievementsData: AchievementCategory[] = ${JSON.stringify(data, null, 4)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'achievements.ts'), tsContent, 'utf8');
console.log(`Generated achievements.ts successfully with ${data.length} categories!`);
let totalItems = data.reduce((acc, cat) => acc + cat.items.length, 0);
console.log(`Total achievements items: ${totalItems}`);
data.forEach(c => console.log(` - ${c.category}: ${c.items.length} items`));

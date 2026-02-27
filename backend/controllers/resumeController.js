const pdfParse = require("pdf-parse");
const User = require("../models/User");
const Gig = require("../models/Gig");

const skillDictionary = [
  // Frontend
  "React", "Vue", "Angular", "Svelte", "Next.js", "Nuxt.js", "Gatsby", "Vite",
  "TypeScript", "JavaScript", "HTML", "CSS", "Tailwind", "Bootstrap", "Sass", "Less",
  "Redux", "Vuex", "Zustand", "Recoil", "MobX",
  "Jest", "Vitest", "React Testing Library", "Cypress", "Playwright",
  // Backend
  "Node.js", "Express", "Fastify", "Nest.js", "Python", "Django", "Flask", "FastAPI",
  "Java", "Spring", "Spring Boot", "Go", "Golang", "Rust", "PHP", "Laravel",
  "Ruby", "Rails", "C#", ".NET", "C++", "Kotlin",
  // Databases
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch", "Cassandra",
  "Firebase", "Supabase", "DynamoDB", "Prisma", "Sequelize", "SQLAlchemy",
  "SQL", "NoSQL", "GraphQL",
  // Cloud & DevOps
  "AWS", "Azure", "GCP", "Google Cloud", "Heroku", "DigitalOcean", "Vercel", "Netlify",
  "Docker", "Kubernetes", "Jenkins", "CI/CD", "GitHub Actions", "GitLab CI", "CircleCI",
  "Terraform", "CloudFormation",
  // APIs & Protocols
  "REST", "RESTful", "SOAP", "OAuth", "JWT", "API", "Webhook",
  // Data & ML
  "Machine Learning", "Deep Learning", "TensorFlow", "PyTorch", "Keras", "Scikit-learn",
  "NLP", "Computer Vision", "Data Science", "Pandas", "NumPy", "Matplotlib", "Seaborn",
  "Jupyter", "Anaconda", "SQL", "ETL",
  // Other Tech
  "Git", "GitHub", "GitLab", "Bitbucket", "Jira", "Slack", "Figma", "Adobe XD",
  "Linux", "Windows", "MacOS", "Unix",
  "Agile", "Scrum", "Kanban", "Waterfall",
  "SEO", "Analytics", "A/B Testing",
  "WebAssembly", "PWA", "Responsive Design", "Mobile First",
  "Performance Optimization", "SEO", "Accessibility", "WCAG",
  "Microservices", "Monolithic", "Serverless", "Lambda",
  "Message Queues", "RabbitMQ", "Kafka", "AWS SQS",
  "Authentication", "Authorization", "Security", "Encryption", "SSL", "TLS",
  "Caching", "Load Balancing", "Rate Limiting",
  "API Documentation", "Swagger", "OpenAPI", "Postman",
];

exports.uploadResume = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const data = await pdfParse(req.file.buffer);
    const fullText = data.text;

    // extract skills from dictionary
    const extractedSkills = skillDictionary.filter(skill =>
      fullText.toLowerCase().includes(skill.toLowerCase())
    );

    // remove duplicates
    const uniqueSkills = [...new Set(extractedSkills)];

    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        skills: uniqueSkills,
        resumeText: fullText
      },
      { new: true }
    );

    // asynchronously generate embedding for resume
    try {
      const embeddingService = require("../services/embeddingService");
      embeddingService.getUserEmbedding(user).catch(() => {});
    } catch (e) {}

    // Simple semantic-ready response
    res.json({
      message: "Resume analyzed successfully",
      extractedSkills
    });

  } catch (error) {
    console.error("RESUME ERROR:", error);
    res.status(500).json({ message: "Resume processing failed", error: error.message });
  }
};
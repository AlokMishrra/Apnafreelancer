import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronRight, Sparkles, BookOpen, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RoadmapFormProps {
  isOpen: boolean;
  onClose: () => void;
}

const courses = [
  { value: "web-development", label: "Web Development" },
  { value: "mobile-development", label: "Mobile App Development" },
  { value: "data-science", label: "Data Science" },
  { value: "ui-ux-design", label: "UI/UX Design" },
  { value: "digital-marketing", label: "Digital Marketing" },
  { value: "ai-ml", label: "AI & Machine Learning" },
  { value: "blockchain", label: "Blockchain Development" },
  { value: "cyber-security", label: "Cyber Security" },
];

const experienceLevels = [
  { value: "beginner", label: "Beginner (No prior experience)" },
  { value: "intermediate", label: "Intermediate (Some experience)" },
  { value: "advanced", label: "Advanced (Experienced)" },
];

const RoadmapForm = ({ isOpen, onClose }: RoadmapFormProps) => {
  const [name, setName] = useState("");
  const [education, setEducation] = useState("");
  const [course, setCourse] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [goals, setGoals] = useState("");
  const [timeframe, setTimeframe] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [roadmapGenerated, setRoadmapGenerated] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);

  const handleSubmit = () => {
    setSubmitting(true);
    
    // Simulate API call for roadmap generation
    setTimeout(() => {
      // Generate mock roadmap data based on inputs
      const generatedRoadmap = generateRoadmap(course, experienceLevel);
      setRoadmapData(generatedRoadmap);
      setRoadmapGenerated(true);
      setSubmitting(false);
    }, 2000);
  };

  const handleReset = () => {
    setRoadmapGenerated(false);
    setName("");
    setEducation("");
    setCourse("");
    setExperienceLevel("");
    setGoals("");
    setTimeframe("");
  };

  const generateRoadmap = (course: string, level: string) => {
    // Mock roadmap data
    const roadmaps: any = {
      "web-development": {
        beginner: {
          title: "Web Development Roadmap for Beginners",
          description: "A comprehensive learning path to become a web developer from scratch.",
          duration: "6 months",
          phases: [
            {
              title: "Phase 1: Foundations (4 weeks)",
              tasks: [
                "HTML5 fundamentals and semantic markup",
                "CSS3 styling and layouts",
                "JavaScript basics and DOM manipulation",
                "Responsive design principles"
              ],
              resources: ["MDN Web Docs", "freeCodeCamp", "W3Schools"]
            },
            {
              title: "Phase 2: Frontend Development (8 weeks)",
              tasks: [
                "Advanced JavaScript concepts",
                "Modern JavaScript (ES6+)",
                "React.js fundamentals",
                "State management with React hooks",
                "CSS frameworks (Tailwind CSS)"
              ],
              resources: ["React Documentation", "JavaScript.info", "Tailwind CSS Documentation"]
            },
            {
              title: "Phase 3: Backend Basics (8 weeks)",
              tasks: [
                "Node.js fundamentals",
                "Express.js framework",
                "RESTful API development",
                "Database basics with MongoDB",
                "Authentication and authorization"
              ],
              resources: ["Node.js Documentation", "MongoDB University", "Express.js Guide"]
            },
            {
              title: "Phase 4: Projects & Portfolio (4 weeks)",
              tasks: [
                "Full-stack MERN application",
                "Portfolio website",
                "Deploy applications to production",
                "GitHub profile optimization"
              ],
              resources: ["GitHub", "Vercel", "Netlify", "Render"]
            }
          ],
          certification: ["freeCodeCamp Web Development Certification", "Responsive Web Design Certification"]
        },
        intermediate: {
          title: "Web Development Roadmap for Intermediate Developers",
          description: "Enhance your web development skills with advanced concepts and modern frameworks.",
          duration: "5 months",
          phases: [
            {
              title: "Phase 1: Advanced Frontend (6 weeks)",
              tasks: [
                "React.js advanced patterns",
                "State management with Redux or Zustand",
                "Next.js for server-side rendering",
                "TypeScript fundamentals",
                "Advanced CSS (Styled Components, CSS Modules)"
              ],
              resources: ["Next.js Documentation", "Redux Documentation", "TypeScript Handbook"]
            },
            {
              title: "Phase 2: Backend & API Development (6 weeks)",
              tasks: [
                "Node.js advanced concepts",
                "Express.js middleware and security",
                "GraphQL API development",
                "MongoDB aggregation pipelines",
                "JWT authentication and OAuth"
              ],
              resources: ["Apollo GraphQL Documentation", "MongoDB Documentation", "JWT.io"]
            },
            {
              title: "Phase 3: DevOps & Deployment (4 weeks)",
              tasks: [
                "CI/CD pipelines",
                "Docker containerization",
                "AWS/Firebase cloud services",
                "Automated testing (Jest, React Testing Library)"
              ],
              resources: ["AWS Documentation", "Docker Documentation", "GitHub Actions"]
            }
          ],
          certification: ["AWS Certified Developer", "MongoDB Developer Certification"]
        }
      },
      "data-science": {
        beginner: {
          title: "Data Science Roadmap for Beginners",
          description: "A step-by-step path to start your data science journey.",
          duration: "8 months",
          phases: [
            {
              title: "Phase 1: Mathematics & Programming Foundations (8 weeks)",
              tasks: [
                "Python programming basics",
                "Mathematics for data science",
                "Statistics fundamentals",
                "Data structures and algorithms"
              ],
              resources: ["Khan Academy", "Codecademy Python", "StatQuest YouTube Channel"]
            },
            {
              title: "Phase 2: Data Analysis & Visualization (8 weeks)",
              tasks: [
                "Data manipulation with Pandas",
                "Data visualization with Matplotlib and Seaborn",
                "Exploratory data analysis",
                "SQL for data retrieval"
              ],
              resources: ["Pandas Documentation", "Mode SQL Tutorial", "Kaggle Courses"]
            }
          ],
          certification: ["IBM Data Science Professional Certificate", "DataCamp Data Scientist Track"]
        }
      }
    };
    
    // Return the specific roadmap or a default one if not found
    return roadmaps[course]?.[level] || roadmaps["web-development"]["beginner"];
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        {!roadmapGenerated ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                Generate Your Roadmap
              </DialogTitle>
              <DialogDescription>
                Tell us about yourself and your goals, and we'll create a personalized roadmap for you.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Your Name</Label>
                  <Input
                    id="name"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="education">Current Education/Class</Label>
                  <Input
                    id="education"
                    placeholder="e.g., College, 10th Grade, Working Professional"
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="course">Course Interest</Label>
                <Select value={course} onValueChange={setCourse}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((c) => (
                      <SelectItem key={c.value} value={c.value}>
                        {c.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience">Current Skill Level</Label>
                <Select value={experienceLevel} onValueChange={setExperienceLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your current level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="goals">What skills do you want to learn?</Label>
                <Textarea
                  id="goals"
                  placeholder="Describe the specific skills you want to learn or career goals you want to achieve"
                  value={goals}
                  onChange={(e) => setGoals(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="timeframe">Learning Timeframe</Label>
                <Input
                  id="timeframe"
                  placeholder="e.g., 3 months, 6 months, 1 year"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onClose()}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="mr-2">Generating</span>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                  </>
                ) : (
                  "Generate Roadmap"
                )}
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
                  {roadmapData.title}
                </span>
              </DialogTitle>
              <DialogDescription className="flex items-center">
                <Sparkles className="h-4 w-4 mr-2 text-blue-500" />
                <span>Personalized learning path for {name}</span>
                <Badge variant="outline" className="ml-auto">
                  {roadmapData.duration}
                </Badge>
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6 my-4">
              <p className="text-muted-foreground">{roadmapData.description}</p>
              
              <div className="space-y-4">
                {roadmapData.phases.map((phase: any, index: number) => (
                  <Card key={index} className="border border-border">
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold mb-3 flex items-center">
                        <BookOpen className="w-5 h-5 text-primary mr-2" />
                        {phase.title}
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">Key Topics & Skills:</h4>
                          <ul className="space-y-2">
                            {phase.tasks.map((task: string, i: number) => (
                              <li key={i} className="flex items-start">
                                <CheckCircle className="w-4 h-4 text-green-500 mr-2 mt-1 flex-shrink-0" />
                                <span>{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        {phase.resources && (
                          <div>
                            <h4 className="text-sm font-medium text-muted-foreground mb-2">Recommended Resources:</h4>
                            <div className="flex flex-wrap gap-2">
                              {phase.resources.map((resource: string, i: number) => (
                                <Badge key={i} variant="secondary">{resource}</Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {roadmapData.certification && (
                <div className="bg-muted/40 p-4 rounded-lg border border-border">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Award className="w-5 h-5 text-primary mr-2" />
                    Recommended Certifications
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {roadmapData.certification.map((cert: string, index: number) => (
                      <li key={index} className="flex items-center">
                        <ChevronRight className="w-4 h-4 text-primary mr-2" />
                        <span>{cert}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleReset}
              >
                Create New Roadmap
              </Button>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                onClick={() => onClose()}
              >
                Done
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default RoadmapForm;
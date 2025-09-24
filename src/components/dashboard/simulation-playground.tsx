'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, FlaskConical } from 'lucide-react';

const simulations: { [key: string]: any } = {
  business: {
    title: "Startup Launch Simulation",
    description: "You are the CEO of a new tech startup. Your goal is to develop a business plan, pitch to investors, and launch a minimum viable product (MVP) within a simulated 6-month period. Manage your budget, make key hiring decisions, and navigate market challenges.",
    tasks: ["Develop a 10-page business plan.", "Create a pitch deck for investors.", "Allocate a virtual $100k budget.", "Respond to 3 market event scenarios."],
    icon: FlaskConical
  },
  medicine: {
    title: "Emergency Room Triage Simulation",
    description: "You are an ER doctor on a busy night shift. A multi-car pile-up has resulted in several patients arriving simultaneously. You must assess each patient's condition, prioritize treatment based on urgency (triage), and delegate tasks to your medical team to save as many lives as possible.",
    tasks: ["Triage 5 incoming patients with varying injuries.", "Order appropriate diagnostic tests for each patient.", "Create a treatment plan for the most critical patient.", "Manage limited resources like ICU beds."],
    icon: FlaskConical
  },
  tech: {
    title: "Deploy a Web App",
    description: "Your team has just finished developing a new social media analytics dashboard. Your task is to take the source code, containerize it using Docker, set up a CI/CD pipeline, and deploy it to a cloud provider. Ensure the application is scalable and secure.",
    tasks: ["Write a Dockerfile for a Node.js application.", "Configure a GitHub Actions workflow for CI/CD.", "Set up a virtual server and database.", "Perform a security scan and load test."],
    icon: FlaskConical
  },
  art: {
    title: "AI-Assisted Museum Curation",
    description: "You are the curator for a new digital art exhibition. Using a provided dataset of 50 artworks, your goal is to create a cohesive exhibition. Use AI tools to analyze the artworks for themes, styles, and color palettes, and write a compelling curatorial statement.",
    tasks: ["Group artworks into 3-5 thematic sections.", "Generate descriptive labels for 10 artworks using an AI assistant.", "Design a virtual layout for the exhibition.", "Write a 500-word curatorial statement."],
    icon: FlaskConical
  },
  language: {
    title: "Virtual Travel Conversation Practice",
    description: "You are planning a trip to a foreign country. This simulation will take you through three common scenarios: ordering food at a restaurant, asking for directions to a landmark, and checking into a hotel. You will need to use the target language to navigate each situation successfully with an AI language partner.",
    tasks: ["Successfully order a three-course meal.", "Navigate from your hotel to a famous museum.", "Handle a reservation issue at the hotel front desk.", "Learn and use 10 new vocabulary words."],
    icon: FlaskConical
  },
  general: {
    title: "Select a Domain",
    description: "Please select a domain from the home page to see a relevant simulation.",
    tasks: [],
    icon: FlaskConical
  }
};


export default function SimulationPlayground({ domain }: { domain: string }) {
  const simulation = simulations[domain] || simulations.general;
  const Icon = simulation.icon;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
            <Icon className="w-8 h-8 text-primary" />
            <CardTitle>{simulation.title}</CardTitle>
        </div>
        <CardDescription>{simulation.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Your Tasks</h3>
          <ul className="space-y-2">
            {simulation.tasks.map((task: string, index: number) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <span>{task}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex justify-start">
          <Button>Start Simulation</Button>
        </div>
      </CardContent>
    </Card>
  );
}

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, ArrowRight, Play } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="max-w-2xl text-center space-y-6">
        {/* Badge */}
        <Badge variant="secondary" className="px-4 py-1">
          <BookOpen className="w-3 h-3 mr-1" />
          AI-Powered Reading Companion
        </Badge>

        {/* Main Heading with gradient */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text">
          Don&apos;t just read.
          <br />
          <span className="text-primary">Discuss and Retain</span>
        </h1>

        {/* Description */}
        <p className="max-w-xl mx-auto text-base sm:text-lg text-muted-foreground">
          Engage in deep book dialogues on Sway Nway. Our AI automatically
          summarizes your chats and analyzes key themes so you never lose
          a &ldquo;Eureka!&rdquo; moment.
        </p>
      </div>

      {/* CTAs */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8">
        <Button size="lg" className="cursor-pointer">
          Get Started for Free
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
        <Button size="lg" variant="outline" className="cursor-pointer">
          <Play className="w-4 h-4 mr-2" />
          Watch Demo
        </Button>
      </div>
    </div>
  );
}

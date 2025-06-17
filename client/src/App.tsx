import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen">
          <header className="header">
            <div className="container">
              <h1 className="header_text"><b>Free Nutritional Facts Table Generator</b></h1>
            </div>
          </header>
          <main>
            <Router />
          </main>
          <footer className="mt-12" style={{backgroundColor: '#6B7280', color: 'white'}}>
            <div className="max-w-7xl mx-auto py-6 px-4 overflow-hidden sm:px-6 lg:px-8">
              <p className="text-center text-sm">
                &copy; {new Date().getFullYear()} Nutritional Facts Table Generator. All rights reserved.
              </p>
            </div>
          </footer>
          <Toaster />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

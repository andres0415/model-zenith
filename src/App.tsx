import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import Index from "./pages/Index";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { ModelRegister } from "./pages/ModelRegister";
import { Reports } from "./pages/Reports";
import { Monitoring } from "./pages/Monitoring";
import { Experiments } from "./pages/Experiments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/register" element={<ModelRegister />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/experiments" element={<Experiments />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;

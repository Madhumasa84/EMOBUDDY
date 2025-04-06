import { Toaster } from "./components/ui/toaster";
import { Switch, Route } from "wouter";
import Layout from "./components/layout/Layout";
import Home from "./pages/Home";
import Journal from "./pages/Journal";
import Reports from "./pages/Reports";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "./hooks/use-auth";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ChatProvider } from "./context/ChatContext";

function Router() {
  return (
    <Switch>
      <ProtectedRoute 
        path="/" 
        component={() => (
          <Layout>
            <Home />
          </Layout>
        )} 
      />
      <ProtectedRoute 
        path="/journal" 
        component={() => (
          <Layout>
            <Journal />
          </Layout>
        )} 
      />
      <ProtectedRoute 
        path="/reports" 
        component={() => (
          <Layout>
            <Reports />
          </Layout>
        )} 
      />
      <ProtectedRoute 
        path="/resources" 
        component={() => (
          <Layout>
            <Resources />
          </Layout>
        )} 
      />
      <ProtectedRoute 
        path="/profile" 
        component={() => (
          <Layout>
            <Profile />
          </Layout>
        )} 
      />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
        <Toaster />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

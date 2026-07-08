import { createBrowserRouter } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";

import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";

import Home from "./pages/public/Home";
import About from "./pages/public/About";
import Events from "./pages/public/Events";
import Contact from "./pages/public/Contact";
import BuyTicket from "./pages/public/BuyTicket";

import Login from "./pages/admin/Login";
import Dashboard from "./pages/admin/Dashboard";
import AdminEvents from "./pages/admin/Events";
import CreateEvent from "./pages/admin/CreateEvent";
import EditEvent from "./pages/admin/EditEvent";
import Tickets from "./pages/admin/Tickets";
import VerifyTickets from "./pages/admin/VerifyTickets";
import PurchasedTickets from "./pages/admin/PurchasedTickets";
import Settings from "./pages/admin/Settings";
import ManageAdmins from "./pages/admin/ManageAdmins";
import AdminRequests from "./pages/admin/AdminRequests";
import ContentManagement from "./pages/admin/ContentManagement";
import HomepageCMS from "./pages/admin/cms/HomepageCMS";
import HeroCMS from "./pages/admin/cms/HeroCMS";
import FoundersCMS from "./pages/admin/cms/FoundersCMS";
import SponsorsCMS from "./pages/admin/cms/SponsorsCMS";
import TestimonialsCMS from "./pages/admin/cms/TestimonialsCMS";
import ProgramCMS from "./pages/admin/cms/ProgramCMS";
import GalleryCMS from "./pages/admin/cms/GalleryCMS";
import Reports from "./pages/admin/Reports";
import TicketCenter from "./pages/admin/TicketCenter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <PublicLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <About />,
      },
      {
        path: "events",
        element: <Events />,
      },
      {
        path: "events/:id/buy",
        element: <BuyTicket />,
      },
      {
        path: "contact",
        element: <Contact />,
      },
    ],
  },

  {
    path: "/login",
    element: <Login />,
  },

  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),

    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "events",
        element: <AdminEvents />,
      },

      {
        path: "create-event",
        element: <CreateEvent />,
      },

      {
        path: "edit-event/:id",
        element: <EditEvent />,
      },

      {
        path: "tickets/:id",
        element: <Tickets />,
      },

      {
        path: "ticket-center",
        element: <TicketCenter />,
      },

      {
        path: "verify",
        element: <VerifyTickets />,
      },

      {
        path: "purchased-tickets",
        element: <PurchasedTickets />,
      },

      {
        path: "admins",
        element: <ManageAdmins />,
      },

      {
        path: "admin-requests",
        element: <AdminRequests />,
      },

      {
        path: "content",
        element: <ContentManagement />,
      },

      {
        path: "content/homepage",
        element: <HomepageCMS />,
      },

      {
        path: "content/hero",
        element: <HeroCMS />,
      },

      {
        path: "content/founders",
        element: <FoundersCMS />,
      },

      {
        path: "content/sponsors",
        element: <SponsorsCMS />,
      },

      {
        path: "content/testimonials",
        element: <TestimonialsCMS />,
      },

      {
        path: "content/programs",
        element: <ProgramCMS />,
      },

      {
        path: "content/gallery",
        element: <GalleryCMS />,
      },

      {
        path: "content/contact",
        element: <HeroCMS />,
      },

      {
        path: "content/footer",
        element: <HeroCMS />,
      },

      {
        path: "reports",
        element: <Reports />,
      },

      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
]);

export default router;
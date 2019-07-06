import async from "../components/Async";

import {
  Monitor as MonitorIcon,
  Users as UsersIcon
} from "react-feather";

//Landing page
import Landing from "../pages/landing/Landing";

// Auth
import SignIn from "../pages/auth/SignIn";
import SignUp from "../pages/auth/SignUp";
import ResetPassword from "../pages/auth/ResetPassword";
import Page404 from "../pages/auth/Page404";
import Page500 from "../pages/auth/Page500";

// Dashboards
const TeacherClassroom = async(() => import("../pages/teacher/classroom"));
const StudentClassroom = async(() => import("../pages/student/classroom"));

// Routes
const landingRoute = {
  path: "/",
  name: "Landing Page",
  component: Landing,
  children: null
};

const teacherClassroomRoute = {
    path: "/teacher/classroom",
    name: "Classroom",
    header: "강의실",
    icon: MonitorIcon,
    containsHome: true,
    component: TeacherClassroom,
    badgeColor: "primary",
    badgeText: "New",
    isTeacher: true,
    children: null
};

const studentClassroomRoute = {
  path: "/student/classroom",
  name: "Classroom",
  header: "강의실 (student UI)",
  icon: MonitorIcon,
  containsHome: true,
  component: StudentClassroom,
  badgeColor: "primary",
  badgeText: "New",
  isTeacher: false,
  children: null
};

const authRoutes = {
  path: "/auth",
  name: "Auth",
  icon: UsersIcon,
  badgeColor: "secondary",
  badgeText: "12/24",
  children: [
    {
      path: "/auth/sign-in",
      name: "Sign In",
      component: SignIn
    },
    {
      path: "/auth/sign-up",
      name: "Sign Up",
      component: SignUp
    },
    {
      path: "/auth/reset-password",
      name: "Reset Password",
      component: ResetPassword
    },
    {
      path: "/auth/404",
      name: "404 Page",
      component: Page404
    },
    {
      path: "/auth/500",
      name: "500 Page",
      component: Page500
    }
  ]
};

export const landingRoutes = [landingRoute];

export const teacherRoutes = [
  teacherClassroomRoute
];

export const studentRoutes = [
  studentClassroomRoute
];

export const auth = [authRoutes];

// All routes (displayed on sidebar)
export default [
  teacherClassroomRoute,
  studentClassroomRoute,
  authRoutes
];
